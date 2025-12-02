<%
// 6834068080772400646
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false,
        sTemplateName: "INFORMER", // for error msgs
        sBlockPrefix: "block_informer", // for common get_web_param calls
        sConstructor: "WTLPInformer" // for constructor call
    });

/* TEMPLATE-DEPENDING FUNCTIONS */
function _CUSTOM_BuildBrowserData(oArgs)
{
    var oBData = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData));
    if(oBData.oParams.sDataFormat=="single" || oBData.oParams.sDataFormat=="single_max")
    {
        oBData.oParams.sLabel = _Substitute({ sText: oBData.oParams.sLabel });
        oBData.oParams.sValue = _Substitute({ sText: oBData.oParams.sValue });
        if(oBData.oParams.sDataFormat=="single_max")
        {
            oBData.oParams.sDivider = _Substitute({ sText: oBData.oParams.sDivider });
            oBData.oParams.sMax = _Substitute({ sText: oBData.oParams.sMax });
        }
        oBData.oParams.sIconCustom = _Substitute({ sText: oBData.oParams.sIconCustom });
        oBData.oParams.sLink = _Substitute({ sText: oBData.oParams.sLink });
    }
    tools_lp.update_runtime_env({ oData: oBData });
    return oBData;
}
function _CUSTOM_BuildDesignData(oArgs)
{
    var aDesignParams =
        [
            { name: "sColorBG", var_name: "color_bg", type: "string", def: "#ffffff" },
            { name: "bUseBorder", var_name: "use_border", type: "bool", def: false },
            { name: "iBorderSize", var_name: "border_size", type: "int", def: 1 },
            { name: "sColorBorder", var_name: "color_border", type: "string", def: "#c2c3c4" },
            { name: "nTilePadding", var_name: "tile_padding", type: "real", def: 1 },
            { name: "sInnerAlign", var_name: "tile_inner_align", type: "string", def: "center" },
            { name: "sInnerValign", var_name: "tile_inner_valign", type: "string", def: "center" },
            { name: "bIsRounded", var_name: "is_rounded", type: "bool", def: false },
            { name: "bUseShadow", var_name: "use_shadow", type: "bool", def: false },

            { name: "sFontFamily", var_name: "font_family", type: "string", def: "Roboto" },
            { name: "sFontFamilyCustom", var_name: "font_family_custom", type: "string", def: "" },
            { name: "sFontSize", var_name: "font_size", type: "string", def: "medium" },
            { name: "sFontWeight", var_name: "font_weight", type: "string", def: "normal" },
            { name: "sFontStyle", var_name: "font_style", type: "string", def: "normal" },
            { name: "sFontColor", var_name: "color_font", type: "string", def: "#262626" },

            { name: "sIconAlign", var_name: "icon_align", type: "string", def: "center" },
            { name: "iIconWidth", var_name: "icon_width", type: "int", def: 40 },
            { name: "sValueColor", var_name: "color_icon_value", type: "string", def: "#262626" },
            { name: "sScaleColor", var_name: "color_icon_scale", type: "string", def: "#c2c3c4" },
            { name: "nIconMargin", var_name: "icon_margin", type: "real", def: 0.5 },

            { name: "sValueFontFamily", var_name: "value_font_family", type: "string", def: "Roboto" },
            { name: "sValueFontFamilyCustom", var_name: "value_font_family_custom", type: "string", def: "" },
            { name: "sValueFontSize", var_name: "value_font_size", type: "string", def: "medium" },
            { name: "sValueFontWeight", var_name: "value_font_weight", type: "string", def: "normal" },
            { name: "sValueFontStyle", var_name: "value_font_style", type: "string", def: "normal" },
            { name: "sValueFontColor", var_name: "color_value_font", type: "string", def: "#262626" },

            { name: "sMaxFontFamily", var_name: "max_font_family", type: "string", def: "Roboto" },
            { name: "sMaxFontFamilyCustom", var_name: "max_font_family_custom", type: "string", def: "" },
            { name: "sMaxFontSize", var_name: "max_font_size", type: "string", def: "medium" },
            { name: "sMaxFontWeight", var_name: "max_font_weight", type: "string", def: "normal" },
            { name: "sMaxFontStyle", var_name: "max_font_style", type: "string", def: "normal" },
            { name: "sMaxFontColor", var_name: "color_max_font", type: "string", def: "#262626" },

            { name: "sTileAlign", var_name: "tile_align", type: "string", def: "left" },
            { name: "iTileWidth", var_name: "tile_width", type: "int", def: 20 },
            { name: "sTileSize", var_name: "tile_size", type: "string", def: "square" },
            { name: "nTileSizeCustom", var_name: "tile_size_custom", type: "real", def: 20 },
            { name: "sAlign", var_name: "text_align", type: "string", def: "center" },
            { name: "sIconType", var_name: "icon_type", type: "string", def: "icon" },
            { name: "sIcon", var_name: "icon", type: "string", def: "single" },
            { name: "sDataFormat", var_name: "data_format", type: "string", def: "single" }

        ];
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
    return g_oALL[sHexOWTId].oDesignData;
}
function _CUSTOM_BuildFldsToSub(oArgs)
{
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sLabel!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sLabel);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sValue!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sValue);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sIconCustom)
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sIconCustom);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sLink!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sLink);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sDataFormat=="single_max")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sDivider);
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sMax);
    }
    return g_oALL[sHexOWTId].aFldsToSub;
}
function _CUSTOM_BuildHTML(oArgs)
{
    var sHTMLData = "";

    var nMargin = 0;

    var aWorkareaCSS = tools_lp.get_workarea_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    aWorkareaCSS.push("text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sAlign);
    var aWorkareaClasses = [ "wt-lp-winformer-workarea" ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });

    var aWrapperClasses = [ "wt-lp-winformer-wrapper", "wt-lp-winformer-wrapper-align-" + g_oALL[sHexOWTId].oDesignData.oParams.sTileAlign ];
    var aWrapperCSS = [];

    var aTileCSS = [ "width:" + g_oALL[sHexOWTId].oDesignData.oParams.iTileWidth + "%;min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iTileWidth + "%;max-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iTileWidth + "%;margin-left:" + nMargin + "%;margin-right:" + nMargin + "%" ];
    var aTileClasses = [ "wt-lp-winformer-tile" ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sTileSize=="square")
    {
        aTileClasses.push("wt-lp-winformer-tile-square");
    }
    else if(g_oALL[sHexOWTId].oDesignData.oParams.sTileSize=="custom")
    {
        aTileCSS.push("min-height:" + g_oALL[sHexOWTId].oDesignData.oParams.nTileSizeCustom + "rem;height:" + g_oALL[sHexOWTId].oDesignData.oParams.nTileSizeCustom + "rem;max-height:" + g_oALL[sHexOWTId].oDesignData.oParams.nTileSizeCustom + "rem");
    }
    var bHasBG = (g_oALL[sHexOWTId].oDesignData.oParams.sColorBG!="" && g_oALL[sHexOWTId].oDesignData.oParams.sColorBG!="transparent");
    if(bHasBG)
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.bUseShadow) { aTileClasses.push("wt-lp-winformer-has-shadow"); }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseBorder)
    {
        aTileClasses.push("wt-lp-winformer-has-border");
        aTileCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBorderSize + "px;border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBorder);
    }
    if((g_oALL[sHexOWTId].oDesignData.oParams.bUseBorder || bHasBG) && g_oALL[sHexOWTId].oDesignData.oParams.bIsRounded)
    {
        aTileClasses.push("wt-lp-winformer-is-rounded");
    }
    var aContentClasses = [ "wt-lp-winformer-content" ];
    var aContentCSS = [ ];

    var aTitleClasses = [ "wt-lp-winformer-title" ];
    var aTitleCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sFont" }), ("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nTilePadding + "rem;text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sAlign) ];
    if(bHasBG)
    {
        aTitleCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBG);
    }
    if((g_oALL[sHexOWTId].oDesignData.oParams.bUseBorder || bHasBG) && g_oALL[sHexOWTId].oDesignData.oParams.bIsRounded)
    {
        aTitleClasses.push("wt-lp-winformer-is-rounded-top");
    }

    var aValueContainerClasses = [ "wt-lp-winformer-value-container wt-lp-winformer-value-container-" + g_oALL[sHexOWTId].oDesignData.oParams.sIconAlign ];
    var aValueContainerCSS = [ "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nTilePadding + "rem" ];
    if(bHasBG)
    {
        aValueContainerCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBG);
    }
    if((g_oALL[sHexOWTId].oDesignData.oParams.bUseBorder || bHasBG) && g_oALL[sHexOWTId].oDesignData.oParams.bIsRounded)
    {
        aValueContainerClasses.push("wt-lp-winformer-is-rounded-bottom");
    }

    var aValueWrapperClasses = [ "wt-lp-winformer-value-wrapper" ];
    var aValueWrapperCSS = [];
    var aValueBlockClasses = [ "wt-lp-winformer-value-block" ];
    var aValueBlockCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sIconType=="icon" && g_oALL[sHexOWTId].oDesignData.oParams.sIcon=="_block")
    {
        aValueBlockCSS.push("border-left:solid 0.8rem " + g_oALL[sHexOWTId].oDesignData.oParams.sValueColor + ";padding-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nIconMargin + "rem" );
    }

    var aIconClasses = [ "wt-lp-winformer-icon" ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sIcon=="custom")
    {
        aIconClasses.push("wt-lp-winformer-icon-custom");
    }
    var aIconCSS = [ "min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iIconWidth + "%;width:" + g_oALL[sHexOWTId].oDesignData.oParams.iIconWidth + "%" ];
    switch(g_oALL[sHexOWTId].oDesignData.oParams.sIconAlign)
    {
        case "left":
        {
            aIconCSS.push("margin-right:" + g_oALL[sHexOWTId].oDesignData.oParams.nIconMargin + "rem");
            aValueContainerCSS.push("align-items:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sInnerValign] + ";justify-content:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sInnerAlign]);
            aValueWrapperCSS.push("justify-content:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sInnerAlign]);
            break;
        }
        case "right":
        {
            aIconCSS.push("margin-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nIconMargin + "rem");
            aValueContainerCSS.push("align-items:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sInnerValign] + ";justify-content:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sInnerAlign]);
            if(g_oALL[sHexOWTId].oDesignData.oParams.sInnerAlign=="left")
            {
                aValueWrapperCSS.push("justify-content:flex-end");
            }
            else if(g_oALL[sHexOWTId].oDesignData.oParams.sInnerAlign=="right")
            {
                aValueWrapperCSS.push("justify-content:flex-start");
            }
            else
            {
                aValueWrapperCSS.push("justify-content:center");
            }
            break;
        }
        case "top":
        {
            aIconCSS.push("margin-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nIconMargin + "rem");
            break;
        }
        case "bottom":
        {
            aIconCSS.push("margin-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nIconMargin + "rem");
            break;
        }
    }

    var aValueClasses = [ "wt-lp-winformer-value" ];
    var aValueCSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sValueFont", bArray: true });
    var aDividerClasses = [ "wt-lp-winformer-divider" ];
    var aDividerCSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sMaxFont", bArray: true });
    var aMaxClasses = [ "wt-lp-winformer-max" ];
    var aMaxCSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sMaxFont", bArray: true });


    var sCSSToAppend = " div[wt-owt-id='" + sHexOWTId + "'] .wt-ico, div[wt-owt-id='" + sHexOWTId + "'] .wt-ico-graph { fill:" + g_oALL[sHexOWTId].oDesignData.oParams.sValueColor + "; }";
    sCSSToAppend += " div[wt-owt-id='" + sHexOWTId + "'] .wt-ico .wt-ico-nofill-stroke { stroke:" + g_oALL[sHexOWTId].oDesignData.oParams.sValueColor + "; }";
    sCSSToAppend += " div[wt-owt-id='" + sHexOWTId + "'] .wt-graph-donut .wt-graph-scale { stroke:" + g_oALL[sHexOWTId].oDesignData.oParams.sScaleColor + "; }";
    sCSSToAppend += " div[wt-owt-id='" + sHexOWTId + "'] .wt-graph-donut .wt-graph-segment { stroke:" + g_oALL[sHexOWTId].oDesignData.oParams.sValueColor + "; }";
    sCSSToAppend += " div[wt-owt-id='" + sHexOWTId + "'] .wt-graph-pie .wt-graph-scale { fill:" + g_oALL[sHexOWTId].oDesignData.oParams.sScaleColor + "; }";
    sCSSToAppend += " div[wt-owt-id='" + sHexOWTId + "'] .wt-graph-pie .wt-graph-segment { fill:" + g_oALL[sHexOWTId].oDesignData.oParams.sValueColor + "; }";
    sCSSToAppend += " div[wt-owt-id='" + sHexOWTId + "'] .wt-graph-bar.wt-graph-bg { border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sScaleColor + "; }";
    sCSSToAppend += " div[wt-owt-id='" + sHexOWTId + "'] .wt-graph-bar .wt-graph-scale { background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sScaleColor + "; }";
    sCSSToAppend += " div[wt-owt-id='" + sHexOWTId + "'] .wt-graph-bar .wt-graph-segment { background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sValueColor + "; }";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle, sPrefix: ".wt-lp-winformer-workarea[wt-id='" + sHexOWTId + "'] " });
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
    sHTMLData += '<div class="' + aTileClasses.join(' ') + '" wt-owt-id="' + sHexOWTId + '" wt-tile-parent="' + sHexOWTId + '" wt-lazy-item="" style="' + aTileCSS.join(';') + '" wt-role="item">';
    sHTMLData += '<div class="' + aContentClasses.join(' ') + '" style="' + aContentCSS.join(';') + '" wt-role="content">';
    sHTMLData += '<div class="' + aTitleClasses.join(' ') + '" style="' + aTitleCSS.join(';') + '" wt-role="title"></div>';
    sHTMLData += '<div class="' + aValueContainerClasses.join(' ') + '" style="' + aValueContainerCSS.join(';') + '" wt-role="value-container">';
    sHTMLData += '<div class="' + aValueWrapperClasses.join(' ') + '" style="' + aValueWrapperCSS.join(';') + '" wt-role="value-wrapper">';
    sHTMLData += '<div class="' + aIconClasses.join(' ') + '" style="' + aIconCSS.join(';') + '" wt-role="icon"></div>';
    sHTMLData += '<div class="' + aValueBlockClasses.join(' ') + '" style="' + aValueBlockCSS.join(';') + '" wt-role="value-block">';
    sHTMLData += '<div class="' + aValueClasses.join(' ') + '" style="' + aValueCSS.join(';') + '" wt-role="value"></div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sDataFormat=="single_max")
    {
        sHTMLData += '<div class="' + aDividerClasses.join(' ') + '" style="' + aDividerCSS.join(';') + '" wt-role="divider"></div>';
        sHTMLData += '<div class="' + aMaxClasses.join(' ') + '" style="' + aMaxCSS.join(';') + '" wt-role="max"></div>';
    }
    sHTMLData += '</div>';
    sHTMLData += '</div>';
    sHTMLData += '</div>';
    sHTMLData += '</div>';
    sHTMLData += '</div>';
    sHTMLData += '</div>';
    sHTMLData += '<div class="' + aWrapperClasses.join(' ') + '" style="' + aWrapperCSS.join(';') + '" wt-role="wrapper">';
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
            { name: "sDataType", var_name: "data_type", type: "string", def: "number" },
            { name: "sDataFormat", var_name: "data_format", type: "string", def: "single" },
            { name: "sDisplayType", var_name: "display_type", type: "string", def: "value_max" },
            { name: "sLabel", var_name: "single_label", type: "string", def: "" },
            { name: "sValue", var_name: "single_value", type: "string", def: "" },
            { name: "sDivider", var_name: "single_divider", type: "string", def: "/" },
            { name: "sMax", var_name: "single_max", type: "string", def: "100" },
            { name: "sIconType", var_name: "icon_type", type: "string", def: "icon" },
            { name: "sGraphType", var_name: "graph_type", type: "string", def: "ring" },
            { name: "sIcon", var_name: "icon", type: "string", def: "single" },
            { name: "sIconCustom", var_name: "icon_custom", type: "string", def: "" },
            { name: "sLink", var_name: "single_link", type: "string", def: "" },
            { name: "sSingleActionType", var_name: "single_action_type", type: "string", def: "link" },
            { name: "sSingleURL", var_name: "single_url", type: "string", def: "" },
            { name: "sSingleTargetType", var_name: "single_target_type", type: "string", def: "_self" },
            { name: "sSingleLocalAction", var_name: "single_local_action", type: "string", def: "function" },
            { name: "sSingleLocalFunctionName", var_name: "single_local_function_name", type: "string", def: "" }
        ];
    g_oALL[sHexOWTId].oRuntimeData =
        {
            sOWTId: sHexOWTId,
            sWTId: sHexWTId,
            aItems: [],
            aResult: [],
            oParams: tools_lp.get_owt_params(curParams, aRuntimeParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } )
        };
    g_oALL[sHexOWTId].oRuntimeData.bLPE = bLPE;
    return g_oALL[sHexOWTId].oRuntimeData;
}
/* END TEMPLATE-DEPENDING FUNCTIONS */

/************************************************************************************************/
/* START MAIN FLOW */

var oRuntimeToBrowser;

COMMON_InitMode({ bPlainWidget: true }); // check if we should degrade mode to rebuild smth

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
        oRuntimeToBrowser = _CUSTOM_BuildBrowserData();
        Response.Write( UrlEncode16(EncodeJson( oRuntimeToBrowser, { ExportLargeIntegersAsStrings: true } )) );
        if(bTimingAlert)
        {
            COMMON_LogTiming({ sType: "REFRESH" });
        }
    }
    else
    {
        if(g_oALL[sHexOWTId].oRuntimeData==null)
        {
            g_oALL[sHexOWTId].oRuntimeData = _CUSTOM_BuildRuntimeData();
        }
        oRuntimeToBrowser = _CUSTOM_BuildBrowserData();
        g_oALL[sHexOWTId].sFullHTML = g_oALL[sHexOWTId].sHTMLData + '})</script><div class="wt-init-vars" style="display: none" wt-role="init-data" id="DAT_' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-constructor="' + g_oALL[sHexOWTId].sConstructor + '">' + UrlEncode16(EncodeJson( oRuntimeToBrowser, { ExportLargeIntegersAsStrings: true } )) + '</div><script id="SCR_' + sHexOWTId + '">$(document).ready(function () { WTLP.Build({ sId: "' + sHexOWTId + '" }) })</script>';
        Response.Write(g_oALL[sHexOWTId].sFullHTML);
        if(bTimingAlert)
        {
            COMMON_LogTiming({ sType: "DESIGN CACHE" });
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

    var aToSub = _CUSTOM_BuildFldsToSub();
    if(g_bFCache) // data for fcache
    {
        var sBlockId = tools.random_string(8);
        var sFCache = '<!--[BEGIN ' + sBlockId + ' { "type": "widget", "override_web_template_id": "' + sHexOWTId + '" }]-->';
        sFCache += _CUSTOM_BuildHTML({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bLPE: bLPE, bLegacy: false });

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