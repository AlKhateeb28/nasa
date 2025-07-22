<%
// 6707512945781250809
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false,
        sTemplateName: "TILES", // for error msgs
        sBlockPrefix: "block_tiles", // for common get_web_param calls
        sConstructor: "WTLPTiles" // for constructor call
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
        oElem.rtf_text = _Substitute({ sText: oElem.rtf_text });
        oElem.link_url = _Substitute({ sText: oElem.link_url });
        if(oElem.image!="")
        {
            try
            {
                oElem.image = "download_file.html?file_id=" + Int(oElem.image);
            }
            catch(e)
            {
            }
        }
    }
    oBData.oParams.sMoreText = _Substitute({ sText: g_oALL[sHexOWTId].oRuntimeData.oParams.sMoreText });
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
                                image: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sImage", sParam: "image" }),
                                rtf_text:_MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sRtfText", sParam: "rtf_text" }),
                                link_url: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sLinkURL", sParam: "link_url" })
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
        g_oALL[sHexOWTId].oRuntimeData.aItems = tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".tiles"), [], true );
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
            { name: "iRowLength", var_name: "row_length", type: "int", def: 4 },
            { name: "sTileAlign", var_name: "tile_align", type: "string", def: "left" },
            { name: "bDisplayByPages", var_name: "display_by_pages", type: "bool", def: false },
            { name: "iPageSize", var_name: "page_size", type: "int", def: 1 },
            { name: "sMorePosition", var_name: "more_position", type: "string", def: "center" },
            { name: "sMoreFontFamily", var_name: "more_font_family", type: "string", def: "Roboto" },
            { name: "sMoreFontFamilyCustom", var_name: "more_font_family_custom", type: "string", def: "" },
            { name: "sMoreFontSize", var_name: "more_font_size", type: "string", def: "medium" },
            { name: "sMoreFontWeight", var_name: "more_font_weight", type: "string", def: "normal" },
            { name: "sMoreFontStyle", var_name: "more_font_style", type: "string", def: "normal" },
            { name: "bMoreAsBtn", var_name: "more_as_button", type: "bool", def: false },
            { name: "sColorMoreBtn", var_name: "color_more_btn", type: "string", def: "#4176ea" },
            { name: "sColorMoreBtnHover", var_name: "color_more_btn_hover", type: "string", def: "#355bbb" },
            { name: "sColorMoreBtnText", var_name: "color_more_btn_text", type: "string", def: "#ffffff" },
            { name: "sColorMoreBtnTextHover", var_name: "color_more_btn_text_hover", type: "string", def: "#ffffff" },
            { name: "bMoreBtnIsRounded", var_name: "more_btn_is_rounded", type: "bool", def: true },
            { name: "bMoreBtnUseShadow", var_name: "more_btn_use_shadow", type: "bool", def: false },
            { name: "bMoreBtnUseBorder", var_name: "more_btn_use_border", type: "bool", def: false },
            { name: "sColorMoreBtnBorder", var_name: "color_more_btn_border", type: "string", def: "#4176ea" },
            { name: "sColorMoreBtnBorderHover", var_name: "color_more_btn_border_hover", type: "string", def: "#355bbb" },
            { name: "iMoreBtnBorderWidth", var_name: "more_btn_border_width", type: "int", def: 2 },
            { name: "sTileSize", var_name: "tile_size", type: "string", def: "square" },
            { name: "nTileSizeCustom", var_name: "tile_size_custom", type: "real", def: 20 },
            { name: "sColorBG", var_name: "color_bg", type: "string", def: "#ffffff" },
            { name: "bUseBorder", var_name: "use_border", type: "bool", def: false },
            { name: "iBorderSize", var_name: "border_size", type: "int", def: 1 },
            { name: "sColorBorder", var_name: "color_border", type: "string", def: "#c2c3c4" },
            { name: "bUseImage", var_name: "use_image", type: "bool", def: false },
            { name: "bImageBG", var_name: "image_bg", type: "bool", def: true },
            { name: "bImageIgnorePadding", var_name: "image_ignore_padding", type: "bool", def: true },
            { name: "nImageHeight", var_name: "image_height", type: "real", def: 20 },
            { name: "nTilePadding", var_name: "tile_padding", type: "real", def: 1 },
            { name: "bIsRounded", var_name: "is_rounded", type: "bool", def: false },
            { name: "bUseShadow", var_name: "use_shadow", type: "bool", def: false },
            { name: "sVAlign", var_name: "text_vertical_align", type: "string", def: "center" },
            { name: "sAlign", var_name: "text_align", type: "string", def: "center" },

            { name: "sFontFamily", var_name: "font_family", type: "string", def: "Roboto" },
            { name: "sFontFamilyCustom", var_name: "font_family_custom", type: "string", def: "" },
            { name: "sFontSize", var_name: "font_size", type: "string", def: "medium" },
            { name: "sFontWeight", var_name: "font_weight", type: "string", def: "normal" },
            { name: "sFontStyle", var_name: "font_style", type: "string", def: "normal" },
            { name: "sFontColor", var_name: "color_font", type: "string", def: "#262626" },
            { name: "bUseLink", var_name: "use_link", type: "bool", def: false },
            { name: "sTargetType", var_name: "link_target", type: "string", def: "_blank" },
            { name: "sColorBGHover", var_name: "color_bg_over", type: "string", def: "#ffffff" },
            { name: "sFontColorHover", var_name: "color_font_over", type: "string", def: "#262626" }
        ];
    aDesignParams = ArrayUnion(aDesignParams, aBlockDesignParams);
    aDesignParams = ArrayUnion(aDesignParams, aMsgEmptyDesignParams); // typical msg empty params
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
    /* fixing values */
    if(g_oALL[sHexOWTId].oDesignData.oParams.iRowLength<1)
    {
        g_oALL[sHexOWTId].oDesignData.oParams.iRowLength = 1;
    }
    else if(g_oALL[sHexOWTId].oDesignData.oParams.iRowLength>8)
    {
        g_oALL[sHexOWTId].oDesignData.oParams.iRowLength = 8;
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayByPages && g_oALL[sHexOWTId].oDesignData.oParams.iPageSize<1)
    {
        g_oALL[sHexOWTId].oDesignData.oParams.bDisplayByPages = false;
    }
    g_oALL[sHexOWTId].oDesignData.oParams.nColWidth = (g_oALL[sHexOWTId].oDesignData.oParams.iRowLength==1) ? 100 : 100/Real(g_oALL[sHexOWTId].oDesignData.oParams.iRowLength) - 2;
    g_oALL[sHexOWTId].oDesignData.oParams.nColGrow = 0.01*g_oALL[sHexOWTId].oDesignData.oParams.nColWidth;
    g_oALL[sHexOWTId].oDesignData.oParams.nMargin = (g_oALL[sHexOWTId].oDesignData.oParams.iRowLength==1) ? 0 : Real(g_oALL[sHexOWTId].oDesignData.oParams.iRowLength)/(g_oALL[sHexOWTId].oDesignData.oParams.iRowLength-1);
    return g_oALL[sHexOWTId].oDesignData;
}
function _CUSTOM_BuildFldsToSub(oArgs)
{
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sMoreText!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sMoreText);
    }
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

    var aWorkareaCSS = tools_lp.get_workarea_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    var aWorkareaClasses = [ "wt-lp-wtiles-workarea" ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aMsgEmptyCSS = _GetMsgEmptyCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });

    var aWrapperClasses = [ "wt-lp-wtiles-wrapper" ];
    AppendBlockClasses({ aTarget: aWrapperClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWrapperCSS = tools_lp.get_block_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    var sWrapperBGAttr = (g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG!="none" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG=="link") ? '' : ' wt-sub-bg="sBlockImgLink"';

    var aListClasses = [ "wt-lp-wtiles-list", "wt-lp-wtiles-list-align-" + g_oALL[sHexOWTId].oDesignData.oParams.sTileAlign ];
    var aListCSS = [];

    var sTileCSS = "width:" + g_oALL[sHexOWTId].oDesignData.oParams.nColWidth + "%;min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.nColWidth + "%;max-width:" + g_oALL[sHexOWTId].oDesignData.oParams.nColWidth + "%;margin-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nMargin + "%;margin-right:" + g_oALL[sHexOWTId].oDesignData.oParams.nMargin + "%;";
    var aTileClasses = [ "wt-lp-wtiles-tile" ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sTileSize=="square")
    {
        aTileClasses.push("wt-lp-wtiles-tile-square");
    }
    else if(g_oALL[sHexOWTId].oDesignData.oParams.sTileSize=="custom")
    {
        sTileCSS += "min-height:" + g_oALL[sHexOWTId].oDesignData.oParams.nTileSizeCustom + "em;height:" + g_oALL[sHexOWTId].oDesignData.oParams.nTileSizeCustom + "em;max-height:" + g_oALL[sHexOWTId].oDesignData.oParams.nTileSizeCustom + "em;";
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bIsRounded)
    {
        aTileClasses.push("wt-lp-wtiles-tile-rounded");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseShadow)
    {
        aTileClasses.push("wt-lp-wtiles-tile-shadow");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseBorder)
    {
        aTileClasses.push("wt-lp-wtiles-tile-border");
        sTileCSS += "border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBorderSize + "px;border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBorder + ";";
    }
    var sImgCSS = "";
    var aImgClasses = [ "wt-lp-wtiles-img" ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseImage)
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.bImageBG)
        {
            aImgClasses.push("wt-lp-wtiles-img-bg");
            aTileClasses.push("wt-lp-wtiles-tile-valign-" + g_oALL[sHexOWTId].oDesignData.oParams.sVAlign);
        }
        else
        {
            aTileClasses.push("wt-lp-wtiles-tile-as-block");
            aImgClasses.push("wt-lp-wtiles-img-as-block");
            sImgCSS = "height:" + g_oALL[sHexOWTId].oDesignData.oParams.nImageHeight + "em;";
            if(g_oALL[sHexOWTId].oDesignData.oParams.bImageIgnorePadding)
            {
                sImgCSS += "margin: 0;";
            }
            else
            {
                sImgCSS += "margin:" + g_oALL[sHexOWTId].oDesignData.oParams.nTilePadding + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nTilePadding + "em 0 " + g_oALL[sHexOWTId].oDesignData.oParams.nTilePadding + "em;";
            }
        }
    }
    else
    {
        aTileClasses.push("wt-lp-wtiles-tile-valign-" + g_oALL[sHexOWTId].oDesignData.oParams.sVAlign);
    }

    var sTextCSS = "font-family:" + (g_oALL[sHexOWTId].oDesignData.oParams.sFontFamily=="Custom" ? g_oALL[sHexOWTId].oDesignData.oParams.sFontFamilyCustom : oLPParams.fontfamily[g_oALL[sHexOWTId].oDesignData.oParams.sFontFamily]) + ";font-weight:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontWeight + ";font-style:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontStyle + ";color:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontColor + ";font-size:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize] + ";padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nTilePadding + "em;text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sAlign + ";";

    var sMoreContainerClass = "wt-lp-wtiles-more-container";
    var sMoreContainerCSS = "";
    var sMoreBtnClass = "wt-lp-wtiles-more-btn wt-lp-wbutton-btn";
    var sMoreBtnCSS = "";
    var sMoreLinkClass = "wt-lp-wtiles-more-link";
    var sMoreLinkCSS = "";

    var sDivCSSName = "#WT_" + sHexOWTId;
    var sCSSToAppend = sDivCSSName + " { " + aWorkareaCSS.join(";") + "; }\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayByPages)
    {
        sMoreContainerCSS += "justify-content:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sMorePosition];
        if(g_oALL[sHexOWTId].oDesignData.oParams.bMoreAsBtn)
        {
            sMoreBtnCSS += "font-family:" + (g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontFamily=="Custom" ? g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontFamilyCustom : oLPParams.fontfamily[g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontFamily]) + ";font-size:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontSize] + ";font-weight:" + g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontWeight + ";font-style:" + g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontStyle + ";";
            sCSSToAppend += "div[wt-owt-id='" + sHexOWTId + "'] .wt-lp-wtiles-more-btn { background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorMoreBtn + "; color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorMoreBtnText + "; } div[wt-owt-id='" + sHexOWTId + "'] .wt-lp-wtiles-more-btn:hover { background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorMoreBtnHover + "; color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorMoreBtnTextHover + "; }";
            if(g_oALL[sHexOWTId].oDesignData.oParams.bMoreBtnIsRounded)
            {
                sMoreBtnClass += " wt-lp-wbutton-btn-rounded";
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.bMoreBtnUseShadow)
            {
                sMoreBtnClass += " wt-lp-wbutton-btn-shadow";
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.bMoreBtnUseBorder)
            {
                sMoreBtnClass += " wt-lp-wbutton-btn-border";
                sMoreBtnCSS += "border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iMoreBtnBorderWidth + "px;";
                sCSSToAppend += "div[wt-owt-id='" + sHexOWTId + "'] .wt-lp-wtiles-more-btn { border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorMoreBtnBorder + "; } div[wt-owt-id='" + sHexOWTId + "'] .wt-lp-wtiles-more-btn:hover { border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorMoreBtnBorderHover + "; }";
            }
        }
        else
        {
            sMoreLinkCSS += "font-family:" + (g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontFamily=="Custom" ? g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontFamilyCustom : oLPParams.fontfamily[g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontFamily]) + ";font-size:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontSize] + ";font-weight:" + g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontWeight + ";font-style:" + g_oALL[sHexOWTId].oDesignData.oParams.sMoreFontStyle + ";";
        }
    }

    sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-wrapper {" + aWrapperCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-msg-empty {" + aMsgEmptyCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-tile {" + sTileCSS + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-img {" + sImgCSS + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-text {" + sTextCSS + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-more-container {" + sMoreContainerCSS + "; }\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayByPages)
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-more-btn {" + sMoreBtnCSS + "; }\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-more-link {" + sMoreLinkCSS + "; }\n";
    }
    sCSSToAppend += sDivCSSName + " div, " + sDivCSSName + " p, " + sDivCSSName + " span, " + sDivCSSName + " a, " + sDivCSSName + " li { font-family:" + (g_oALL[sHexOWTId].oDesignData.oParams.sFontFamily=="Custom" ? g_oALL[sHexOWTId].oDesignData.oParams.sFontFamilyCustom : oLPParams.fontfamily[g_oALL[sHexOWTId].oDesignData.oParams.sFontFamily]) + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-tile { background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBG + "; color:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontColor + "; }\n";
    if((g_oALL[sHexOWTId].oDesignData.oParams.sColorBG!=g_oALL[sHexOWTId].oDesignData.oParams.sColorBGHover || g_oALL[sHexOWTId].oDesignData.oParams.sFontColor!=g_oALL[sHexOWTId].oDesignData.oParams.sFontColorHover) && g_oALL[sHexOWTId].oDesignData.oParams.bUseLink)
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-tile:hover { background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBGHover + "; color:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontColorHover + "; }\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-wtiles-tile:hover .wt-lp-wtiles-text { color:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontColorHover + " !important; }\n";
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
    sHTMLData += '<div class="' + aTileClasses.join(' ') + '" wt-owt-id="' + sHexOWTId + '" wt-tile-parent="' + sHexOWTId + '" wt-lazy-item="" wt-role="item">';
    sHTMLData += '<div class="' + aImgClasses.join(' ') + '" wt-role="img"></div>';
    sHTMLData += '<div class="wt-lp-wtiles-text" wt-role="text"></div>';
    sHTMLData += '<a class="wt-lp-wtiles-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.sTargetType + '" wt-role="link">&nbsp;</a>';
    sHTMLData += '</div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayByPages)
    {
        sHTMLData += '<div class="' + sMoreContainerClass + '" wt-owt-id="' + sHexOWTId + '" wt-lazy-item="" wt-lazy-stop="" wt-lazy-parent-id="' + sHexOWTId + '" wt-role="more-container">';
        if(g_oALL[sHexOWTId].oDesignData.oParams.bMoreAsBtn)
        {
            sHTMLData += '<button type="button" class="' + sMoreBtnClass + '" wt-role="btn-more" wt-sub-html="sMoreText"></button>';
        }
        else
        {
            sHTMLData += '<a href="javascript:void(0)" class="' + sMoreLinkClass + '" wt-role="btn-more" wt-sub-html="sMoreText"></a>';
        }
        sHTMLData += '</div>';
    }
    sHTMLData += '</div>';
    sHTMLData += '<div class="' + aWrapperClasses.join(' ') + '" ' + sWrapperBGAttr + '>';
    sHTMLData += '<div class="' + aListClasses.join(' ') + '" wt-role="list"></div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sWhenEmpty=="msg")
    {
        sHTMLData += '<div class="wt-lp-msg-empty" wt-role="msg-empty" wt-sub-html="sMsgEmpty"></div>';
    }
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
            { name: "bCollectFlds", var_name: "collect_flds", type: "bool", def: false },
            { name: "sRemoteActionType", var_name: "remote_action_type", type: "string", def: "object" },
            { name: "iRemoteActionId", var_name: "__remote_action__", type: "int", def: 0 },
            { name: "iRemoteActionCommonId", var_name: "remote_action_common", type: "int", def: 0 },
            { name: "sLocalAction", var_name: "local_action", type: "string", def: "object" },
            { name: "sLocalVar", var_name: "local_var", type: "string", def: "" },
            { name: "sFunctionName", var_name: "function_name", type: "string", def: "" },
            { name: "sMultipleActionsHeader", var_name: "multiple_actions_header", type: "string", def: "Select action" },
            { name: "sCollectionType", var_name: "collection_type", type: "string", def: "object" },
            { name: "bHTMLAllowed", var_name: "allow_html", type: "bool", def: false },

            { name: "sBlockImgLink", var_name: "block_img_link", type: "string", def: "" },
            { name: "bUseTransition", var_name: "use_transition", type: "bool", def: false },
            { name: "bUseLink", var_name: "use_link", type: "bool", def: false },
            { name: "bUseImage", var_name: "use_image", type: "bool", def: false },
            { name: "bDisplayByPages", var_name: "display_by_pages", type: "bool", def: false },
            { name: "sTileSize", var_name: "tile_size", type: "string", def: "square" },
            { name: "iRowLength", var_name: "row_length", type: "int", def: 4 },
            { name: "iPageSize", var_name: "page_size", type: "int", def: 1 },
            { name: "sMoreText", var_name: "text_more", type: "string", def: "" },

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
                        { name: "sRtfText", var_name: "__mapping__rtf_text", type: "string", def: "" },
                        { name: "sImage", var_name: "__mapping__image", type: "string", def: "" },
                        { name: "sLinkURL", var_name: "__mapping__link_url", type: "string", def: "" },
                        { name: "sRtfTextValue", var_name: "__mapping__rtf_text__value", type: "string", def: "" },
                        { name: "sImageValue", var_name: "__mapping__image__value", type: "string", def: "" },
                        { name: "sLinkURLValue", var_name: "__mapping__link_url__value", type: "string", def: "" }
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
                        { name: "sRtfText", var_name: "__mapping__rtf_text_common", type: "string", def: "" },
                        { name: "sImage", var_name: "__mapping__image_common", type: "string", def: "" },
                        { name: "sLinkURL", var_name: "__mapping__link_url_common", type: "string", def: "" },
                        { name: "sRtfTextValue", var_name: "__mapping__rtf_text_common__value", type: "string", def: "" },
                        { name: "sImageValue", var_name: "__mapping__image_common__value", type: "string", def: "" },
                        { name: "sLinkURLValue", var_name: "__mapping__link_url_common__value", type: "string", def: "" }
                    ];
            }
        }
        g_oALL[sHexOWTId].oRuntimeData.oMapping = tools_lp.get_owt_params(curParams, aMapping, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } );
        g_oALL[sHexOWTId].oRuntimeData.aMap =
            [
                { name_in_item: "image", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sImage" }) },
                { name_in_item: "rtf_text", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sRtfText" }) },
                { name_in_item: "link_url", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sLinkURL" }) }
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
            { name: "sMultipleActionsHeader", value: "Select action" }
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