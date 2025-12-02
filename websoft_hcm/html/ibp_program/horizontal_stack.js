<%
// 6761076384617859954
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false, // true if widget has no data
        sTemplateName: "HORIZONTAL", // for error msgs
        sBlockPrefix: "macro_stack_horizontal", // for common get_web_param calls
        sConstructor: "WTLPMacroColumns" // for constructor call
    });

/* TEMPLATE-DEPENDING FUNCTIONS */
function _CUSTOM_BuildBrowserData(oArgs)
{
    var oBData = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData));
    oBData.oParams.sMacroImgLink = _Substitute({ sText: oBData.oParams.sMacroImgLink });
    oBData.oParams.sBlockImgLink = _Substitute({ sText: oBData.oParams.sBlockImgLink });
    tools_lp.update_runtime_env({ oData: oBData });
    return oBData;
}
function _CUSTOM_BuildDesignData(oArgs)
{
    var aDesignParams =
        [
            { name: "bIsBGPageWide", var_name: "is_bg_pagewide", type: "bool", def: true },
            { name: "bIsPageHigh", var_name: "is_pagehigh", type: "bool", def: false },
            { name: "sVerticalAlign", var_name: "vertical_align", type: "string", def: "center" },
            { name: "nInterColumn", var_name: "intercolumn", type: "real", def: 0 },

            { name: "bBlockHasBG", var_name: "use_workarea", type: "bool", def: false },
            { name: "sColorBlockBG", var_name: "color_workarea", type: "string", def: "#ffffff" },
            { name: "iOpacityBlockBG", var_name: "opacity_workarea", type: "int", def: 100 },
            { name: "sBlockImgBG", var_name: "block_img_bg", type: "string", def: "none" },
            { name: "sBlockImgFile", var_name: "block_img_file", type: "string", def: "" },
            { name: "sBlockImgRepeat", var_name: "block_img_repeat", type: "string", def: "no-repeat" },
            { name: "sBlockImgPosition", var_name: "block_img_position", type: "string", def: "center center" },
            { name: "sBlockImgPositionCustom", var_name: "block_img_position_custom", type: "string", def: "" },
            { name: "sBlockImgSize", var_name: "block_img_size", type: "string", def: "cover" },
            { name: "sBlockImgSizeCustom", var_name: "block_img_size_custom", type: "string", def: "" },
            { name: "bBlockHasBorder", var_name: "use_workarea_border", type: "bool", def: false },
            { name: "sColorBlockBorder", var_name: "color_workarea_border", type: "string", def: "#e2e3e4" },
            { name: "iBlockBorderWidth", var_name: "workarea_border_width", type: "int", def: 1 },
            { name: "bBlockHasShadow", var_name: "use_shadow", type: "bool", def: false },
            { name: "bBlockIsRounded", var_name: "is_rounded", type: "bool", def: false },
            { name: "nBlockPaddingLeft", var_name: "block_padding_left", type: "real", def: 0 },
            { name: "nBlockPaddingRight", var_name: "block_padding_right", type: "real", def: 0 },
            { name: "nBlockPaddingTop", var_name: "block_padding_top", type: "real", def: 0 },
            { name: "nBlockPaddingBottom", var_name: "block_padding_bottom", type: "real", def: 0 },

            { name: "bMacroHasBG", var_name: "use_bg", type: "bool", def: true },
            { name: "sColorBGMacro", var_name: "color_bg", type: "string", def: "#f2f3f4" },
            { name: "sColorMaskMacro", var_name: "color_mask", type: "string", def: "#000000" },
            { name: "iOpacityMaskMacro", var_name: "opacity_mask", type: "int", def: 25 },
            { name: "sMacroImgBG", var_name: "img_bg", type: "string", def: "resource" },
            { name: "sMacroImgFile", var_name: "file_bg", type: "string", def: "" },
            { name: "sMacroImgRepeat", var_name: "img_repeat", type: "string", def: "no-repeat" },
            { name: "sMacroImgPosition", var_name: "img_position", type: "string", def: "center center" },
            { name: "sMacroImgPositionCustom", var_name: "img_position_custom", type: "string", def: "" },
            { name: "sMacroImgSize", var_name: "img_size", type: "string", def: "cover" },
            { name: "sMacroImgSizeCustom", var_name: "img_size_custom", type: "string", def: "" },

            { name: "bUseColumnBG", var_name: "use_column_bg", type: "bool", def: false },
            { name: "sColorColumnBG", var_name: "color_column_bg", type: "string", def: "#f2f3f4" },
            { name: "bIsColumnRounded", var_name: "is_column_rounded", type: "bool", def: false },
            { name: "iOpacityColumnBG", var_name: "opacity_column_bg", type: "int", def: 100 },
            { name: "bUseColumnShadow", var_name: "use_column_shadow", type: "bool", def: false },
            { name: "sColumnVerticalAlign", var_name: "column_vertical_align", type: "string", def: "top" },
            { name: "bUseColumnBorder", var_name: "use_column_border", type: "bool", def: false },
            { name: "sColorColumnBorder", var_name: "color_column_border", type: "string", def: "#c2c3c4" },
            { name: "iColumnBorderWidth", var_name: "column_border_width", type: "int", def: 1 },
            { name: "bUseDividers", var_name: "use_dividers", type: "bool", def: false },
            { name: "bDisplaySideDividers", var_name: "display_side_dividers", type: "bool", def: false },
            { name: "sColorDivider", var_name: "color_divider", type: "string", def: "#c2c3c4" },
            { name: "iDividerWidth", var_name: "divider_width", type: "int", def: 1 },
            { name: "nDividerMargin", var_name: "divider_margin", type: "real", def: 1 },

            { name: "bUseSwitch", var_name: "use_switch", type: "bool", def: false },
            { name: "sCollapse", var_name: "switch_text_collapse", type: "string", def: "Collapse" },
            { name: "sExpand", var_name: "switch_text_expand", type: "string", def: "Expand" },
            { name: "sSwitchSymbol", var_name: "switch_symbol", type: "string", def: "arrow" },
            { name: "sSwitchAlign", var_name: "switch_align", type: "string", def: "left" },
            { name: "sSwitchSymbolAlign", var_name: "switch_symbol_position", type: "string", def: "left" },
            { name: "sSwitchFontFamily", var_name: "switch_font_family", type: "string", def: "Roboto" },
            { name: "sSwitchFontFamilyCustom", var_name: "switch_font_family_custom", type: "string", def: "" },
            { name: "sSwitchFontSize", var_name: "switch_font_size", type: "string", def: "medium" },
            { name: "sSwitchFontWeight", var_name: "switch_font_weight", type: "string", def: "normal" },
            { name: "sSwitchFontStyle", var_name: "switch_font_style", type: "string", def: "normal" },
            { name: "sSwitchFontColor", var_name: "color_switch_font", type: "string", def: "#4176ea" },
            { name: "sSwitchFontColorHover", var_name: "color_switch_font_hover", type: "string", def: "#355bbb" },
            { name: "bSwitchHasBG", var_name: "switch_has_bg", type: "bool", def: false },
            { name: "sSwitchColorBG", var_name: "color_switch_bg", type: "string", def: "#f2f3f4" },
            { name: "sSwitchColorBGHover", var_name: "color_switch_bg_hover", type: "string", def: "#f2f3f4" },
            { name: "bSwitchHasBorder", var_name: "switch_has_border", type: "bool", def: true },
            { name: "bSwitchBorderBottomOnly", var_name: "switch_border_bottom_only", type: "bool", def: true },
            { name: "sSwitchColorBorder", var_name: "color_switch_border", type: "string", def: "#e2e3e4" },
            { name: "sSwitchColorBorderHover", var_name: "color_switch_border_hover", type: "string", def: "#e2e3e4" },
            { name: "iSwitchBorderWidth", var_name: "switch_border_width", type: "int", def: 1 },
            { name: "bSwitchIsRounded", var_name: "switch_is_rounded", type: "bool", def: false },
            { name: "nSwitchPaddingLeft", var_name: "switch_padding_left", type: "real", def: 0 },
            { name: "nSwitchPaddingRight", var_name: "switch_padding_right", type: "real", def: 0 },
            { name: "nSwitchPaddingTop", var_name: "switch_padding_top", type: "real", def: 0.5 },
            { name: "nSwitchPaddingBottom", var_name: "switch_padding_bottom", type: "real", def: 0.5 },
            { name: "nSwitchMargin", var_name: "switch_margin", type: "real", def: 0.5 }
        ];
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
    g_oALL[sHexOWTId].oDesignData.oParams.sColumnVerticalAlign = oLPParams.flexalign[ g_oALL[sHexOWTId].oDesignData.oParams.sColumnVerticalAlign ];
    g_oALL[sHexOWTId].oDesignData.oParams.sStackType = "horizontal";
    g_oALL[sHexOWTId].oDesignData.oParams.arrColumns = tools_web.get_web_param( curParams, "macro_stack_horizontal.columns", [], true );
    g_oALL[sHexOWTId].oDesignData.oParams.aZones = ParseJson(tools_web.get_web_param( curParams, "macro_stack_horizontal.__service__zones", "[]", true ));
    return g_oALL[sHexOWTId].oDesignData;
}
function _CUSTOM_BuildFldsToSub(oArgs)
{
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sMacroImgLink!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sMacroImgLink);
    }
    return g_oALL[sHexOWTId].aFldsToSub;
}
function _CUSTOM_BuildHTML(oArgs)
{
    var sHTMLData = "";

    var aLegacyDesignUpdates =
        [
            { name: "sCustomBGCode", value: "" },
            { name: "bUseSwitch", value: false },
            { name: "sSwitchSymbol", value: "arrow" },
            { name: "sSwitchAlign", value: "left" },
            { name: "sSwitchSymbolAlign", value: "left" },
            { name: "sSwitchFontFamily", value: "Roboto" },
            { name: "sSwitchFontFamilyCustom", value: "" },
            { name: "sSwitchFontSize", value: "medium" },
            { name: "sSwitchFontWeight", value: "normal" },
            { name: "sSwitchFontStyle", value: "normal" },
            { name: "sSwitchFontColor", value: "#4176ea" },
            { name: "sSwitchFontColorHover", value: "#355bbb" },
            { name: "bSwitchHasBG", value: false },
            { name: "sSwitchColorBG", value: "#f2f3f4" },
            { name: "sSwitchColorBGHover", value: "#f2f3f4" },
            { name: "bSwitchHasBorder", value: true },
            { name: "bSwitchBorderBottomOnly", value: true },
            { name: "sSwitchColorBorder", value: "#e2e3e4" },
            { name: "sSwitchColorBorderHover", value: "#e2e3e4" },
            { name: "iSwitchBorderWidth", value: 1 },
            { name: "bSwitchIsRounded", value: false },
            { name: "nSwitchPaddingLeft", value: 0 },
            { name: "nSwitchPaddingRight", value: 0 },
            { name: "nSwitchPaddingTop", value: 0.5 },
            { name: "nSwitchPaddingBottom", value: 0.5 },
            { name: "nSwitchMargin", value: 0.5 }
        ];
    if(aLegacyDesignUpdates.length>0 && g_oALL[sHexOWTId].oDesignData!=null)
    {
        g_oALL[sHexOWTId].oDesignData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oDesignData.oParams, aLegacyDesignUpdates);
    }

    var sJustify = "center";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bIsPageHigh && g_oALL[sHexOWTId].oDesignData.oParams.sVerticalAlign!="center")
    {
        sJustify = (g_oALL[sHexOWTId].oDesignData.oParams.sVerticalAlign=="top") ? "flex-start" : "flex-end";
    }

    var aMacroBlockClasses = [ "wt-lp-macro-block", "wt-lp-base-font-size" ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSClass!="")
    {
        aMacroBlockClasses.push(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSClass);
    }
    var aMacroBlockCSS = [];

    var aMacroBlockBGCSS = [];
    var aMacroBlockMaskCSS = [];
    var aMacroBlockBGClasses = [];
    var aMacroBlockMaskClasses = [];
    var sNacroBGAttr = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bMacroHasBG)
    {
        aMacroBlockBGClasses.push("wt-lp-macro-bg");
        aMacroBlockBGCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBGMacro);
        aMacroBlockMaskClasses.push("wt-lp-macro-bg-mask");
        aMacroBlockMaskCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorMaskMacro);
        aMacroBlockMaskCSS.push("opacity:" + (0.01*g_oALL[sHexOWTId].oDesignData.oParams.iOpacityMaskMacro));
        sMacroBGAttr = (g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgBG!="none" && g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgBG=="link") ? ' wt-sub-bg="sMacroImgLink"' : '';
        if(g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgBG!="none")
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgBG=="resource")
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgFile!="")
                {
                    aMacroBlockBGCSS.push("background-image:url('download_file.js?file_id=" + g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgFile + "')");
                }
            }
            aMacroBlockBGCSS.push("background-repeat:" + g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgRepeat);
            if(g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgPosition!="custom")
            {
                aMacroBlockBGCSS.push("background-position:" + g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgPosition);
            }
            else
            {
                aMacroBlockBGCSS.push("background-position:" + g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgPositionCustom);
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgSize!="custom")
            {
                aMacroBlockBGCSS.push("background-size:" + g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgSize);
            }
            else
            {
                aMacroBlockBGCSS.push("background-size:" + g_oALL[sHexOWTId].oDesignData.oParams.sMacroImgSizeCustom);
            }
        }
        if(!g_oALL[sHexOWTId].oDesignData.oParams.bIsBGPageWide)
        {
            aMacroBlockBGClasses.push("wt-lp-bg-width");
            aMacroBlockMaskClasses.push("wt-lp-bg-width");
        }
    }

    var aWorkareaClasses = ["wt-lp-macro-workarea", "wt-lp-base-font-size", "wt-lp-workarea-width"];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bIsPageHigh)
    {
        aMacroBlockClasses.push("wt-lp-workarea-pagehigh");
    }
    var aWorkareaBGClasses = ["wt-lp-macro-workarea-bg"];
    var aWorkareaCSS = [ "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingLeft + "em; justify-content:" + sJustify ];
    var aWorkareaBGCSS = [];
    var sWrapperBGAttr = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG)
    {
        aWorkareaClasses.push("wt-lp-macro-workarea-has-bg");
        aWorkareaBGCSS.push("display:block;");
        aWorkareaBGCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBG);
        aWorkareaBGCSS.push("opacity:" + (0.01*g_oALL[sHexOWTId].oDesignData.oParams.iOpacityBlockBG));
        sWrapperBGAttr = (g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG!="none" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG=="link") ? ' wt-sub-bg="sBlockImgLink"' : '';
        if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG!="none")
        {
            aWorkareaBGCSS.push("background-repeat:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgRepeat);
            if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG=="resource")
            {
                aWorkareaBGCSS.push("background-image:url('download_file.js?file_id=" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgFile + "')");
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgPosition!="custom")
            {
                aWorkareaBGCSS.push("background-position:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgPosition);
            }
            else
            {
                aWorkareaBGCSS.push("background-position:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgPositionCustom);
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgSize!="custom")
            {
                aWorkareaBGCSS.push("background-size:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgSize);
            }
            else
            {
                aWorkareaBGCSS.push("background-size:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgSizeCustom);
            }
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasShadow)
        {
            aWorkareaClasses.push("wt-lp-has-shadow");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockIsRounded)
        {
            aWorkareaBGClasses.push("wt-lp-is-rounded");
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBorder)
    {
        aWorkareaClasses.push("wt-lp-macro-workarea-has-border");
        aWorkareaCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder);
        aWorkareaCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG || g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBorder)
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockIsRounded)
        {
            aWorkareaClasses.push("wt-lp-is-rounded");
        }
        aWorkareaCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nBlockPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockPaddingLeft + "em");
    }

    var aMacroColumnsClasses = ["wt-lp-macro-columns"];
    var aMacroColumnsCSS = [];
    var aMacroColumnClasses = ["wt-lp-macro-column"];
    var aMacroColumnCSS = [ "justify-content:" + g_oALL[sHexOWTId].oDesignData.oParams.sColumnVerticalAlign ];
    var aMacroColumnBGClasses = ["wt-lp-macro-column-bg"];
    var aMacroColumnBGCSS = [];
    var aMacroColumnDividerClasses = [];
    var aMacroColumnDividerCSS = [ "background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorDivider, "min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDividerWidth + "px", "width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDividerWidth + "px", "max-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDividerWidth + "px" ];
    var aMacroColumnContentClasses = [ "wt-lp-macro-column-content" ];
    var aMacroColumnContentCSS = [];

    if(!g_oALL[sHexOWTId].oDesignData.oParams.bUseDividers)
    {
        aMacroColumnsClasses.push("wt-lp-macro-columns-no-divider");
    }
    else
    {
        aMacroColumnsClasses.push("wt-lp-macro-columns-has-dividers");
        aMacroColumnDividerClasses.push("wt-lp-macro-column-divider");
    }

    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnBG)
    {
        aMacroColumnClasses.push("wt-lp-macro-column-has-bg");
        aMacroColumnBGCSS.push("display:block");
        aMacroColumnBGCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorColumnBG);
        aMacroColumnBGCSS.push("opacity:" + g_oALL[sHexOWTId].oDesignData.oParams.iOpacityColumnBG + "%");
        if(g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnShadow)
        {
            aMacroColumnClasses.push("wt-lp-macro-column-shadow");
        }
    }

    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnBorder)
    {
        aMacroColumnClasses.push("wt-lp-macro-column-has-border");
        aMacroColumnCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorColumnBorder);
        aMacroColumnCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iColumnBorderWidth + "px");
    }
    if((g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnBG || g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnBorder) && g_oALL[sHexOWTId].oDesignData.oParams.bIsColumnRounded)
    {
        aMacroColumnClasses.push("wt-lp-macro-column-rounded");
        aMacroColumnBGClasses.push("wt-lp-macro-column-rounded");
    }

    var sMacroColumnClasses = aMacroColumnClasses.join(" ");
    var sMacroColumnCSS = aMacroColumnCSS.join(";");
    var sMacroColumnBGClasses = aMacroColumnBGClasses.join(" ");
    var sMacroColumnBGCSS = aMacroColumnBGCSS.join(";");
    var sMacroColumnDividerClasses = aMacroColumnDividerClasses.join(" ");
    var sMacroColumnDividerCSS = aMacroColumnDividerCSS.join(";");
    var sMacroColumnContentClasses = aMacroColumnContentClasses.join(" ");
    var sMacroColumnContentCSS = aMacroColumnContentCSS.join(";");
    var sCSSToAppend = "";
    var iCnt = 0;
    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle, sPrefix: ".wt-lp-macro-block[wt-id='" + sHexOWTId + "'] " });
    }

    sHTMLData = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop!="")
    {
        sHTMLData += '<a id="' + g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop + '"></a>';
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseSwitch)
    {
        var aSwitchClasses = [ "wt-lp-macro-switch", "wt-lp-base-font-size", "wt-lp-workarea-width" ];
        var aSwitchCSS = _GetFontCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sSwitchFont", bArray: true, bOmitColor: true });
        aSwitchCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nSwitchPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nSwitchPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nSwitchPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nSwitchPaddingLeft + "em");
        aSwitchCSS.push("margin:0 auto " + g_oALL[sHexOWTId].oDesignData.oParams.nSwitchMargin + "em auto");
        sCSSToAppend += " .wt-lp-macro-switch[wt-target-id='" + sHexOWTId + "'] { color:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColor + "; fill:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColor + "; stroke:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColor + "; }";
        sCSSToAppend += " .wt-lp-macro-switch[wt-target-id='" + sHexOWTId + "']:hover { color:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColorHover + "; fill:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColorHover + "; stroke:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchFontColorHover + "; }";
        if(g_oALL[sHexOWTId].oDesignData.oParams.bSwitchHasBG)
        {
            aSwitchCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchColorBG);
            sCSSToAppend += " .wt-lp-macro-switch[wt-target-id='" + sHexOWTId + "']:hover { background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchColorBGHover + "; }";
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bSwitchHasBorder)
        {
            aSwitchClasses.push("wt-lp-has-border");
            if(g_oALL[sHexOWTId].oDesignData.oParams.bSwitchBorderBottomOnly)
            {
                aSwitchCSS.push("border-width:0 0 " + g_oALL[sHexOWTId].oDesignData.oParams.iSwitchBorderWidth + "px 0");
            }
            else
            {
                aSwitchCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iSwitchBorderWidth + "px");
            }
            aSwitchCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchColorBorder);
            sCSSToAppend += " .wt-lp-macro-switch[wt-target-id='" + sHexOWTId + "']:hover { border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchColorBorderHover + "; }";
        }
        if((g_oALL[sHexOWTId].oDesignData.oParams.bSwitchHasBG || g_oALL[sHexOWTId].oDesignData.oParams.bSwitchHasBorder) && g_oALL[sHexOWTId].oDesignData.oParams.bSwitchIsRounded)
        {
            aSwitchClasses.push("wt-lp-is-rounded");
        }
        var sIconHTML = "";
        if(g_oALL[sHexOWTId].oDesignData.oParams.sSwitchSymbol!="none")
        {
            sIconHTML = '<div class="wt-lp-macro-switch-icon wt-lp-macro-switch-icon-' + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchSymbol + '" wt-role="switch-icon">';
            switch(g_oALL[sHexOWTId].oDesignData.oParams.sSwitchSymbol)
            {
                case "arrow":
                {
                    sIconHTML += '<svg class="icon-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z" /></svg>';
                    break;
                }
                case "plus_minus":
                case "plus_cross":
                {
                    sIconHTML += '<svg class="icon-svg" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><line class="plus-h" x1="2" x2="10" y1="6" y2="6"/><line class="plus-v" x1="6" x2="6" y1="2" y2="10"/></svg>';
                    break;
                }
            }
            sIconHTML += '</div>';
        }
        sHTMLData += '<div wt-target-id="' + sHexOWTId + '" class="' + aSwitchClasses.join(" ") + '" wt-role="macro-switch" style="' + aSwitchCSS.join(";") + '" wt-state="expanded" wt-pos="' + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchAlign + '" wt-symbol="' + g_oALL[sHexOWTId].oDesignData.oParams.sSwitchSymbolAlign + '">';
        if(g_oALL[sHexOWTId].oDesignData.oParams.sSwitchSymbolAlign=="left")
        {
            sHTMLData += sIconHTML;
        }
        sHTMLData += '<div wt-text="collapse" >' + g_oALL[sHexOWTId].oDesignData.oParams.sCollapse + '</div>';
        sHTMLData += '<div wt-text="expand" >' + g_oALL[sHexOWTId].oDesignData.oParams.sExpand + '</div>';
        if(g_oALL[sHexOWTId].oDesignData.oParams.sSwitchSymbolAlign=="right")
        {
            sHTMLData += sIconHTML;
        }
        sHTMLData += '</div>';
    }
    sHTMLData += '<div class="' + aMacroBlockClasses.join(' ') + '" wt-role="macro-block" wt-stack="' + g_oALL[sHexOWTId].oDesignData.oParams.sStackType + '" style="' + aMacroBlockCSS.join(';') + '" wt-id="' + sHexOWTId + '" id="WT_' + sHexOWTId + '" wt-owt-id="' + sHexOWTId + '"';
    if(bLPE)
    {
        sHTMLData += ' wt-used-context="' + aUsedContext.join(";") + '"';
    }
    sHTMLData += '>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bMacroHasBG)
    {
        sHTMLData += '<div class="' + aMacroBlockBGClasses.join(' ') + '" wt-role="macro-block-bg" style="' + aMacroBlockBGCSS.join(';') + '" ' + sMacroBGAttr + '></div>';
        sHTMLData += '<div class="' + aMacroBlockMaskClasses.join(' ') + '" wt-role="macro-block-mask" style="' + aMacroBlockMaskCSS.join(';') + '"></div>';
    }
    sHTMLData += '<div class="' + aWorkareaClasses.join(' ') + '" wt-role="macro-workarea" style="' + aWorkareaCSS.join(';') + '">';
    sHTMLData += '<div class="' + aWorkareaBGClasses.join(' ') + '" wt-role="workarea-bg" style="' + aWorkareaBGCSS.join(';') + '" ' + sWrapperBGAttr + '></div>';
    sHTMLData += '<div class="' + aMacroColumnsClasses.join(' ') + '" wt-role="macro-columns" style="' + aMacroColumnsCSS.join(';') + '">';

    var nFullWidth = 0;
    for(oColumn in g_oALL[sHexOWTId].oDesignData.oParams.arrColumns)
    {
        nFullWidth += OptReal(oColumn.column_size, 50);
    }
    var sHTML;
    iCnt = 0;
    var sColumnCSS = "";
    var sColumnBGCSS = "";
    var sDividerCSS = "";
    iColumn = 0;
    var nW;
    var nPercentW;
    var nPaddingColumn;
    var iLastIdx = ArrayCount(g_oALL[sHexOWTId].oDesignData.oParams.arrColumns);
    var sColumnBGURL;
    if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplaySideDividers)
    {
        iLastIdx--;
    }
    for(oColumn in g_oALL[sHexOWTId].oDesignData.oParams.arrColumns)
    {
        sDividerCSS = sMacroColumnDividerCSS;
        if(g_oALL[sHexOWTId].oDesignData.oParams.bUseDividers && (iCnt==0 && g_oALL[sHexOWTId].oDesignData.oParams.bDisplaySideDividers))
        {
            sDividerCSS += ";margin-left:0;margin-right:" + g_oALL[sHexOWTId].oDesignData.oParams.nDividerMargin + "em";
            sHTMLData += '<div class="' + sMacroColumnDividerClasses + '" wt-role="macro-column-divider" wt-divider-id="' + iCnt + '" style="' + sDividerCSS + '"></div>';
        }

        sColumnCSS = sMacroColumnCSS;
        sColumnBGCSS = sMacroColumnBGCSS;
        if(g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnBG)
        {
            if(oColumn.HasProperty("color_column_bg"))
            {
                if(oColumn.color_column_bg!=undefined && oColumn.color_column_bg!="")
                {
                    sColumnBGCSS += ";background-color:" + oColumn.color_column_bg;
                }
                else
                {
                    sColumnBGCSS += ";background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorColumnBG;
                }
            }
            else
            {
                sColumnBGCSS += ";background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorColumnBG;
            }
            if(oColumn.HasProperty("column_img_bg") && oColumn.HasProperty("column_img_link"))
            {
                sColumnBGURL = "";
                if(oColumn.column_img_link==undefined || oColumn.column_img_link=="")
                {
                    if(oColumn.column_img_bg!=undefined && oColumn.column_img_bg!="")
                    {
                        sColumnBGURL = "download_file.js?file_id=" + oColumn.column_img_bg;
                    }
                }
                else
                {
                    sColumnBGURL = _Substitute({ sText: oColumn.column_img_link });
                }
                if(sColumnBGURL!="")
                {
                    sColumnBGCSS += ";background-image:url('" + sColumnBGURL + "')";
                    if(oColumn.HasProperty("column_css"))
                    {
                        if(oColumn.column_css!=undefined && oColumn.column_css!="")
                        {
                            sColumnBGCSS += ";" + oColumn.column_css;
                        }
                    }
                }
            }
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnBorder)
        {
            if(oColumn.HasProperty("color_column_border"))
            {
                if(oColumn.color_column_border!=undefined && oColumn.color_column_border!="")
                {
                    sColumnCSS += ";border-color:" + oColumn.color_column_border;
                }
                else
                {
                    sColumnCSS += ";border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorColumnBorder;
                }
            }
            else
            {
                sColumnCSS += ";border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorColumnBorder;
            }
        }
        if(oColumn.column_size!=undefined && oColumn.column_size!="")
        {
            nW = OptReal(oColumn.column_size, 50)/nFullWidth;
            nPercentW = 100*nW;
            sColumnCSS += ";flex-grow:" + nW + ";width:" + nPercentW + "%";
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnBG || g_oALL[sHexOWTId].oDesignData.oParams.bUseColumnBorder)
        {
            nPaddingColumn = 2;
            if(oColumn.HasProperty("column_padding"))
            {
                nPaddingColumn = OptReal(oColumn.column_padding);
                if(nPaddingColumn==undefined)
                {
                    nPaddingColumn = 2;
                }
            }
            sColumnCSS += ";padding:" + nPaddingColumn + "em";
        }
        if(ArrayCount(g_oALL[sHexOWTId].oDesignData.oParams.arrColumns)>1 && !g_oALL[sHexOWTId].oDesignData.oParams.bUseDividers && g_oALL[sHexOWTId].oDesignData.oParams.nInterColumn!=0)
        {
            if(iCnt!=0)
            {
                sColumnCSS += ";margin-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nInterColumn + "em;";
            }
        }
        sColClass = (oColumn.GetOptProperty("column_css_class")!=undefined) ? oColumn.column_css_class : "";

        sHTMLData += '<div class="' + sMacroColumnClasses + ' ' + sColClass + '" wt-role="macro-column" wt-owt-id="' + sHexOWTId + '" wt-col-id="' + iCnt + '" style="' + sColumnCSS + '">';
        sHTMLData += '<div class="' + sMacroColumnBGClasses + '" wt-role="macro-column-bg" style="' + sColumnBGCSS + '"></div>';
        sHTMLData += '<div class="' + sMacroColumnContentClasses + '" wt-role="macro-column-content" style="' + sMacroColumnContentCSS + '">~~LPCOLUMN' + iCnt + '~~</div>';
        sHTMLData += '</div>';

        iCnt++;
        iColumn++;
        if(g_oALL[sHexOWTId].oDesignData.oParams.bUseDividers)
        {
            if(iCnt<=iLastIdx)
            {
                if(iCnt>=iLastIdx && g_oALL[sHexOWTId].oDesignData.oParams.bDisplaySideDividers)
                {
                    sDividerCSS += ";margin-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nDividerMargin + "em;margin-right:0";
                }
                else
                {
                    sDividerCSS += ";margin-left:" + g_oALL[sHexOWTId].oDesignData.oParams.nDividerMargin + "em;margin-right:" + g_oALL[sHexOWTId].oDesignData.oParams.nDividerMargin + "em";
                }
                sHTMLData += '<div class="' + sMacroColumnDividerClasses + '" wt-role="macro-column-divider" wt-divider-id="' + iCnt + '" style="' + sDividerCSS + '"></div>';
            }
        }

    }
    sHTMLData += '</div>';
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
            { name: "bBlockHasBG", var_name: "use_workarea", type: "bool", def: false },
            { name: "sBlockImgLink", var_name: "block_img_link", type: "string", def: "" },
            { name: "bMacroHasBG", var_name: "use_bg", type: "bool", def: true },
            { name: "sMacroImgLink", var_name: "img_link", type: "string", def: "" },
            { name: "bUseSwitch", var_name: "use_switch", type: "bool", def: false },
            { name: "bSlide", var_name: "use_slide_effect", type: "bool", def: true },
            { name: "sCollapse", var_name: "switch_text_collapse", type: "string", def: "Collapse" },
            { name: "sExpand", var_name: "switch_text_expand", type: "string", def: "Expand" }
        ];
    g_oALL[sHexOWTId].oRuntimeData =
        {
            sOWTId: sHexOWTId,
            sWTId: sHexWTId,
            aItems: [],
            aResult: [],
            oParams: tools_lp.get_owt_params(curParams, aRuntimeParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } )
        };
    g_oALL[sHexOWTId].oRuntimeData.oParams.sStackType = "horizontal";
    g_oALL[sHexOWTId].oRuntimeData.oParams.arrColumns = tools_web.get_web_param( curParams, "macro_stack_horizontal.columns", [], true );
    g_oALL[sHexOWTId].oRuntimeData.oParams.aZones = ParseJson(tools_web.get_web_param( curParams, "macro_stack_horizontal.__service__zones", "[]", true ));
    var aLegacyRuntimeUpdates =
        [
            { name: "bUseSwitch", value: false },
            { name: "bSlide", value: true },
            { name: "sCollapse", value: "" },
            { name: "sExpand", value: "" }
        ];
    if(aLegacyRuntimeUpdates.length>0)
    {
        g_oALL[sHexOWTId].oRuntimeData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oRuntimeData.oParams, aLegacyRuntimeUpdates);
    }
    g_oALL[sHexOWTId].oRuntimeData.bLPE = bLPE;
    return g_oALL[sHexOWTId].oRuntimeData;
}
function _CUSTOM_FillZones(oArgs)
{
    var sData = oArgs.sData;
    var i, j;
    var iColumn = 0;
    var oColumn;
    var bHasContainerChild = false;
    var aAllChildren = [];
    if(ObjectType(g_oALL[sHexOWTId].oRuntimeData.oParams.aZones)=="JsArray")
    {
        for(i=0; i<g_oALL[sHexOWTId].oRuntimeData.oParams.aZones.length; i++)
        {
            if(ObjectType(g_oALL[sHexOWTId].oRuntimeData.oParams.aZones[i])=="JsArray")
            {
                for(j=0; j<g_oALL[sHexOWTId].oRuntimeData.oParams.aZones[i].length; j++)
                {
                    iCurOWTId = OptInt(g_oALL[sHexOWTId].oRuntimeData.oParams.aZones[i][j]);
                    if(iCurOWTId!=undefined)
                    {
                        aAllChildren.push(iCurOWTId);
                    }
                }
            }
        }
        bHasContainerChild = ( ArrayOptFirstElem( tools.xquery('for $elem in override_web_templates where MatchSome($elem/id, (' + ArrayMerge(aAllChildren, 'This', ',') + ')) and $elem/custom_web_template_id = 6948821390703945323 return $elem/id') ) != undefined);
    }
    if(bHasContainerChild)
    {
        var iXi, iXj, iXCurOWTId;
        var iXColumn = 0;
        var iXCnt = 0;
        var aXCols = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData.oParams.arrColumns));
        var aXZones = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData.oParams.aZones));
        var sXWidgetHTML = "";
        var sXColumnHTML = "";
        var sXActualHTML = sData;
        for(iXi=0; iXi<aXCols.length; iXi++)
        {
            sXColumnHTML = "";
            if(ObjectType(aXZones)=="JsArray")
            {
                if(ArrayCount(aXZones)!=0)
                {
                    if(iXColumn < ArrayCount(aXZones))
                    {
                        if(ObjectType(aXZones[iXColumn])=="JsArray")
                        {
                            if(aXZones[iXColumn].length!=0)
                            {
                                for(iXj=0; iXj<aXZones[iXColumn].length; iXj++)
                                {
                                    iXCurOWTId = OptInt(aXZones[iXColumn][iXj]);
                                    if(!bLPE && !g_bFCache)
                                    {
                                        if (!g_bFCache && !tools_lp.check_web_mode_disp( curWebMode, iXCurOWTId, Env ) )
                                        {
                                            continue;
                                        }
                                    }
                                    try
                                    {
                                        sXWidgetHTML = tools_web.place_override_web_template(iXCurOWTId, { bNoCache: g_bFCache } );
                                    }
                                    catch(e)
                                    {
                                        sXWidgetHTML = "&nbsp;";
                                    }
                                    sXColumnHTML += '<div class="wt-lp-macro-workarea-zone" wt-role="macro-zone" wt-parent-owt-id="' + sHexOWTId + '" wt-col-id="' + iXCnt + '" wt-item-id="' + iXj + '" wt-owt-id="' + aXZones[iXColumn][iXj] + '">' + sXWidgetHTML + '</div>';
                                }
                            }
                            else
                            {
                                sXColumnHTML += '&nbsp;';
                            }
                        }
                        else
                        {
                            sXColumnHTML += '&nbsp;';
                        }
                    }
                    else
                    {
                        sXColumnHTML += '&nbsp;';
                    }
                }
                else
                {
                    sXColumnHTML += '&nbsp;';
                }
            }
            else
            {
                sXColumnHTML += '&nbsp;';
            }
            sXActualHTML = StrReplace(sXActualHTML, ('~~LPCOLUMN' + iXCnt + '~~'), sXColumnHTML);
            iXCnt++;
            iXColumn++;
        }
        sData =	sXActualHTML;
    }
    else
    {
        var iYi, iYj;
        var iYCurOWTId;
        var iYColumn = 0;
        var iYCnt = 0;
        var aYCols = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData.oParams.arrColumns));
        var aYZones = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData.oParams.aZones));
        var sYWidgetHTML = "";
        var sYColumnHTML = "";
        var sYActualHTML = sData;
        for(iYi=0; iYi<aYCols.length; iYi++)
        {
            sYColumnHTML = "";
            if(ObjectType(aYZones)=="JsArray")
            {
                if(ArrayCount(aYZones)!=0)
                {
                    if(iYColumn < ArrayCount(aYZones))
                    {
                        if(ObjectType(aYZones[iYColumn])=="JsArray")
                        {
                            if(aYZones[iYColumn].length!=0)
                            {
                                for(iYj=0; iYj<aYZones[iYColumn].length; iYj++)
                                {
                                    iYCurOWTId = OptInt(aYZones[iYColumn][iYj]);
                                    if(!bLPE && !g_bFCache)
                                    {
                                        if (!g_bFCache && !tools_lp.check_web_mode_disp( curWebMode, iYCurOWTId, Env ) )
                                        {
                                            continue;
                                        }
                                    }
                                    try
                                    {
                                        sYWidgetHTML = tools_web.place_override_web_template(iYCurOWTId, { bNoCache: g_bFCache } );
                                    }
                                    catch(e)
                                    {
                                        sYWidgetHTML = "&nbsp;";
                                    }
                                    sYColumnHTML += '<div class="wt-lp-macro-workarea-zone" wt-role="macro-zone" wt-parent-owt-id="' + sHexOWTId + '" wt-col-id="' + iYCnt + '" wt-item-id="' + iYj + '" wt-owt-id="' + aYZones[iYColumn][iYj] + '">' + sYWidgetHTML + '</div>';
                                }
                            }
                            else
                            {
                                sYColumnHTML += '&nbsp;';
                            }
                        }
                        else
                        {
                            sYColumnHTML += '&nbsp;';
                        }
                    }
                    else
                    {
                        sYColumnHTML += '&nbsp;';
                    }
                }
                else
                {
                    sYColumnHTML += '&nbsp;';
                }
            }
            else
            {
                sYColumnHTML += '&nbsp;';
            }
            sYActualHTML = StrReplace(sYActualHTML, ('~~LPCOLUMN' + iYCnt + '~~'), sYColumnHTML);
            iYCnt++;
            iYColumn++;
        }
        sData =	sYActualHTML;
    }
    return sData;
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
        g_oALL[sHexOWTId].sFullHTML = g_oALL[sHexOWTId].sHTMLData + '})</script><div class="wt-init-vars" style="display: none" wt-role="init-data" id="DAT_' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-constructor="' + g_oALL[sHexOWTId].sConstructor + '">' + UrlEncode16(EncodeJson( oRuntimeToBrowser, { ExportLargeIntegersAsStrings: true } )) + '</div><script id="SCR_' + sHexOWTId + '">$(document).ready(function () { WTLP.Build({ sId: "' + sHexOWTId + '" }) })</script>';
        Response.Write(g_oALL[sHexOWTId].sFullHTML);
        if(bTimingAlert)
        {
            COMMON_LogTiming({ sType: "REFRESH" });
        }
    }
    else
    {
        if(g_oALL[sHexOWTId].oDesignData==null)
        {
            g_oALL[sHexOWTId].oDesignData = _CUSTOM_BuildDesignData();
        }
        if(g_oALL[sHexOWTId].oRuntimeData==null)
        {
            g_oALL[sHexOWTId].oRuntimeData = _CUSTOM_BuildRuntimeData();
        }
        oRuntimeToBrowser = _CUSTOM_BuildBrowserData();
        if(g_oALL[sHexOWTId].sHTMLData==null)
        {
            _CUSTOM_BuildHTML({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bLPE: bLPE, bLegacy: true });
        }
        g_oALL[sHexOWTId].sHTMLData = _CUSTOM_FillZones({ sData: g_oALL[sHexOWTId].sHTMLData, oParams: g_oALL[sHexOWTId].oDesignData.oParams, bLPE: bLPE, bLegacy: true });
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
    var sFullHTML = "";
    if(g_bFCache) // data for fcache
    {
        var sBlockId = tools.random_string(8);
        var sSubs = EncodeJson( tools_lp.list_subs({ aFlds: _CUSTOM_BuildFldsToSub() }));
        var sFCache = '<!--[BEGIN ' + sBlockId + ' { "type": "widget", "override_web_template_id": "' + sHexOWTId + '" }]-->';
        sFCache += _CUSTOM_BuildHTML({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bLPE: bLPE, bLegacy: false });
        sFCache = _CUSTOM_FillZones({ sData: sFCache, oParams: g_oALL[sHexOWTId].oDesignData.oParams, bLPE: bLPE, bLegacy: false });
        sFCache += '<div class="wt-init-vars" style="display: none" wt-role="init-data" id="DAT_' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-constructor="' + g_oALL[sHexOWTId].sConstructor + '">' + UrlEncode16(EncodeJson( g_oALL[sHexOWTId].oRuntimeData, { ExportLargeIntegersAsStrings: true } )) + '</div><script id="SCR_' + sHexOWTId + '">$(document).ready(function () { WTLP.Build({ sId: "' + sHexOWTId + '" }) })</script>';
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
        // now we have unfilled html - that's what must be saved in OWT cache
        var sFilledHTML = _CUSTOM_FillZones({ sData: g_oALL[sHexOWTId].sHTMLData, oParams: g_oALL[sHexOWTId].oDesignData.oParams, bLPE: bLPE, bLegacy: true });

        g_oALL[sHexOWTId].bSaveCache = !bLPE;
        g_oALL[sHexOWTId].sFullHTML = sFilledHTML + '})</script><div class="wt-init-vars" style="display: none" wt-role="init-data" id="DAT_' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-constructor="' + g_oALL[sHexOWTId].sConstructor + '">' + UrlEncode16(EncodeJson( oRuntimeToBrowser, { ExportLargeIntegersAsStrings: true } )) + '</div><script id="SCR_' + sHexOWTId + '">$(document).ready(function () { WTLP.Build({ sId: "' + sHexOWTId + '" }) })</script>';

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
