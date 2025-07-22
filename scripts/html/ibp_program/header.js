<%
// 6561728362502425947
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false,
        sTemplateName: "HEADER", // for error msgs
        sBlockPrefix: "block_header", // for common get_web_param calls
        sConstructor: "WTLPHeader" // for constructor call
    });

/* TEMPLATE-DEPENDING FUNCTIONS (NO COLLECTIONS) */
function _CUSTOM_BuildBrowserData(oArgs)
{
    var oBData = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData));
    oBData.oParams.sBlockImgLink = _Substitute({ sText: oBData.oParams.sBlockImgLink });
    oBData.oParams.sPreHeader = _Substitute({ sText: oBData.oParams.sPreHeader });
    oBData.oParams.sHeader = _Substitute({ sText: oBData.oParams.sHeader });
    oBData.oParams.sSubHeader = _Substitute({ sText: oBData.oParams.sSubHeader });
    oBData.oParams.sHideIconCondition = _Substitute({ sText: oBData.oParams.sHideIconCondition });
    oBData.oParams.sIconPlaceholderURL = _Substitute({ sText: oBData.oParams.sIconPlaceholderURL });
    var sURL = "";
    if(oBData.oParams.sIconType=="file")
    {
        try
        {
            var iIconId = Int(oBData.oParams.sIconFile);
            sURL = "download_file.html?file_id=" + iIconId;
        }
        catch(e)
        {
            sURL = oBData.oParams.sIconFile;
        }
    }
    else
    {
        sURL = _Substitute({ sText: oBData.oParams.sIconURL });
    }
    if(sURL=="")
    {
        sURL = "pics/default-placeholder.png";
    }
    oBData.oParams.sIconURL = sURL;
    tools_lp.update_runtime_env({ oData: oBData });
    return oBData;
}
function _CUSTOM_BuildDesignData(oArgs)
{
    var aDesignParams =
        [
            { name: "sHeaderFontFamily", var_name: "font_family_header", type: "string", def: "Oswald" },
            { name: "sHeaderFontFamilyCustom", var_name: "font_family_custom_header", type: "string", def: "" },
            { name: "sHeaderFontSize", var_name: "font_size_header", type: "string", def: "medium" },
            { name: "sHeaderFontWeight", var_name: "font_weight_header", type: "string", def: "normal" },
            { name: "sHeaderFontStyle", var_name: "font_style_header", type: "string", def: "normal" },
            { name: "sHeaderFontColor", var_name: "color_font_header", type: "string", def: "#999" },
            { name: "sHeaderFontShadow", var_name: "font_shadow", type: "string", def: "#000" },
            { name: "sHeaderFontShadowColor", var_name: "color_font_shadow", type: "string", def: "#000" },
            { name: "sHeaderFontShadowCustom", var_name: "custom_font_shadow", type: "string", def: "#000" },
            { name: "bUppercaseHeader", var_name: "uppercase_header", type: "bool", def: false },

            { name: "sSubHeaderFontFamily", var_name: "font_family_subheader", type: "string", def: "" },
            { name: "sSubHeaderFontFamilyCustom", var_name: "font_family_custom_subheader", type: "string", def: "" },
            { name: "sSubHeaderFontWeight", var_name: "font_weight_subheader", type: "string", def: "" },
            { name: "sSubHeaderFontStyle", var_name: "font_style_subheader", type: "string", def: "" },
            { name: "sSubHeaderFontColor", var_name: "color_font", type: "string", def: "#333" },
            { name: "sSubHeaderFontShadow", var_name: "font_shadow_subheader", type: "string", def: "#000" },
            { name: "sSubHeaderFontShadowColor", var_name: "color_font_shadow_subheader", type: "string", def: "#000" },
            { name: "sSubHeaderFontShadowCustom", var_name: "custom_font_shadow_subheader", type: "string", def: "#000" },
            { name: "bUppercaseSubHeader", var_name: "uppercase_subheader", type: "bool", def: false },

            { name: "bUppercasePreHeader", var_name: "uppercase_preheader", type: "bool", def: true },

            { name: "bDisplayDivider1", var_name: "display_divider1", type: "bool", def: false },
            { name: "sDivider1Type", var_name: "divider1_type", type: "string", def: "fixed" },
            { name: "iDivider1Width", var_name: "divider1_width", type: "int", def: 20 },
            { name: "iDivider1Size", var_name: "divider1_size", type: "int", def: 1 },
            { name: "sDivider1Color", var_name: "color_divider1", type: "string", def: "#f90" },
            { name: "nDivider1PaddingBottom", var_name: "padding_bottom_divider1", type: "real", def: 1 },

            { name: "bDisplayDivider2", var_name: "display_divider2", type: "bool", def: false },
            { name: "sDivider2Type", var_name: "divider2_type", type: "string", def: "fixed" },
            { name: "iDivider2Width", var_name: "divider2_width", type: "int", def: 20 },
            { name: "iDivider2Size", var_name: "divider2_size", type: "int", def: 1 },
            { name: "sDivider2Color", var_name: "color_divider2", type: "string", def: "#f90" },
            { name: "nDivider2PaddingTop", var_name: "padding_top_divider2", type: "real", def: 1 },

            { name: "bDisplayIcon", var_name: "display_icon", type: "bool", def: false },
            { name: "sIconType", var_name: "icon_type", type: "string", def: "file" },
            { name: "sIconFile", var_name: "icon_file", type: "string", def: "" },
            { name: "sIconURL", var_name: "icon_url", type: "string", def: "" },
            { name: "sIconLayout", var_name: "icon_layout", type: "string", def: "full" },
            { name: "sIconPosition", var_name: "icon_position", type: "string", def: "left" },
            { name: "sIconVAlign", var_name: "icon_valign", type: "string", def: "center" },
            { name: "nIconMargin", var_name: "icon_margin", type: "real", def: 2 },
            { name: "nIconSize", var_name: "icon_size", type: "real", def: 10 },
            { name: "iIconHeight", var_name: "icon_height", type: "int", def: 100 },
            { name: "bIconIsRounded", var_name: "icon_is_rounded", type: "bool", def: true },
            { name: "bIconHasShadow", var_name: "icon_has_shadow", type: "bool", def: true },
            { name: "bIconHasBG", var_name: "icon_has_bg", type: "bool", def: false },
            { name: "bIconHasBorder", var_name: "icon_has_border", type: "bool", def: false },
            { name: "sIconColorBG", var_name: "color_icon_bg", type: "string", def: "#eee" },
            { name: "sIconColorBorder", var_name: "color_icon_border", type: "string", def: "#fff" },
            { name: "iIconBorderWidth", var_name: "icon_border_width", type: "int", def: 4 },

            { name: "bBlockHasBG", var_name: "block_has_bg", type: "bool", def: false },
            { name: "sColorBlockBG", var_name: "color_block_bg", type: "string", def: "#FFFFFF" },
            { name: "sBlockImgBG", var_name: "block_img_bg", type: "string", def: "none" },
            { name: "sBlockImgFile", var_name: "block_img_file", type: "string", def: "" },
            { name: "sBlockImgRepeat", var_name: "block_img_repeat", type: "string", def: "no-repeat" },
            { name: "sBlockImgPosition", var_name: "block_img_position", type: "string", def: "center center" },
            { name: "sBlockImgPositionCustom", var_name: "block_img_position_custom", type: "string", def: "" },
            { name: "sBlockImgSize", var_name: "block_img_size", type: "string", def: "cover" },
            { name: "sBlockImgSizeCustom", var_name: "block_img_size_custom", type: "string", def: "" },
            { name: "bBlockHasBorder", var_name: "block_has_border", type: "bool", def: false },
            { name: "sColorBlockBorder", var_name: "color_block_border", type: "string", def: "#CCC" },
            { name: "iBlockBorderWidth", var_name: "block_border_width", type: "int", def: 1 },
            { name: "bBlockHasShadow", var_name: "block_has_shadow", type: "bool", def: false },
            { name: "bBlockIsRounded", var_name: "block_is_rounded", type: "bool", def: false },
            { name: "nBlockPaddingLeft", var_name: "block_padding_left", type: "real", def: 0 },
            { name: "nBlockPaddingRight", var_name: "block_padding_right", type: "real", def: 0 },
            { name: "nBlockPaddingTop", var_name: "block_padding_top", type: "real", def: 0 },
            { name: "nBlockPaddingBottom", var_name: "block_padding_bottom", type: "real", def: 0 },

            { name: "nPaddingBottomPreHeader", var_name: "padding_bottom_preheader", type: "real", def: 1 },
            { name: "nPaddingTopSubHeader", var_name: "padding_top_subheader", type: "real", def: 1 },
            { name: "sAlign", var_name: "align", type: "string", def: "left" }

        ];
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
    var aAddDesignParams =
        [
            { name: "sPreHeaderFontFamily", var_name: "font_family_preheader",type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sSubHeaderFontFamily },
            { name: "sPreHeaderFontFamilyCustom", var_name: "font_family_custom_preheader", type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sSubHeaderFontFamilyCustom },
            { name: "sPreHeaderFontSize", var_name: "font_size_preheader", type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sHeaderFontSize },
            { name: "sPreHeaderFontWeight", var_name: "font_weight_preheader", type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sSubHeaderFontWeight },
            { name: "sPreHeaderFontStyle", var_name: "font_style_preheader", type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sSubHeaderFontStyle },
            { name: "sPreHeaderFontColor", var_name: "color_font_preheader", type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sSubHeaderFontColor },
            { name: "sPreHeaderFontShadow", var_name: "font_shadow_preheader", type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sSubHeaderFontShadow },
            { name: "sPreHeaderFontShadowColor", var_name: "color_font_shadow_preheader", type: "string", def:g_oALL[sHexOWTId].oDesignData.oParams.sSubHeaderFontShadowColor },
            { name: "sPreHeaderFontShadowCustom", var_name: "custom_font_shadow_preheader", type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sSubHeaderFontShadowCustom },
            { name: "sSubHeaderFontSize", var_name: "font_size_subheader", type: "string", def: g_oALL[sHexOWTId].oDesignData.oParams.sHeaderFontSize }
        ];
    var oAddData = { oParams: tools_lp.get_owt_params(curParams, aAddDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
    for(sKey in oAddData.oParams)
    {
        g_oALL[sHexOWTId].oDesignData.oParams[sKey] = oAddData.oParams[sKey];
    }
    return g_oALL[sHexOWTId].oDesignData;
}
function _CUSTOM_BuildFldsToSub(oArgs)
{
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sPreHeader!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sPreHeader);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sHeader!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sHeader);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sSubHeader!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sSubHeader);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sHideIconCondition!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sHideIconCondition);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sIconPlaceholderURL!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sIconPlaceholderURL);
    }
    var sURL = "";
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sIconType=="file")
    {
        try
        {
            var iIconId = Int(g_oALL[sHexOWTId].oRuntimeData.oParams.sIconFile);
            sURL = "download_file.html?file_id=" + iIconId;
        }
        catch(e)
        {
            sURL = g_oALL[sHexOWTId].oRuntimeData.oParams.sIconFile;
        }
        if(sURL!="")
        {
            g_oALL[sHexOWTId].oRuntimeData.oParams.sIconURL = sURL;
        }
    }
    else
    {
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.sIconURL!="")
        {
            g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sIconURL);
        }
    }
    return g_oALL[sHexOWTId].aFldsToSub;
}
function _CUSTOM_BuildHTML(oArgs)
{
    var sHTML = "";

    var aLegacyDesignUpdates =
        [
            { name: "iIconHeight", value: 100 }
        ];
    if(aLegacyDesignUpdates.length>0 && g_oALL[sHexOWTId].oDesignData!=null)
    {
        g_oALL[sHexOWTId].oDesignData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oDesignData.oParams, aLegacyDesignUpdates);
    }

    var aWorkareaClasses = [ "wt-lp-wheader-workarea" ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWorkareaCSS = tools_lp.get_workarea_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    aWorkareaCSS.push("text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.sAlign);

    var aWrapperClasses = [ "wt-lp-wheader-wrapper" ];
    AppendBlockClasses({ aTarget: aWrapperClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWrapperCSS = tools_lp.get_block_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });

    var aIconContainerCSS = [];
    var nIconHeight = 0;
    var aIconCSS = [];
    var aIconClasses = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayIcon)
    {
        aWrapperClasses.push("wt-lp-wheader-wrapper-icon-" + g_oALL[sHexOWTId].oDesignData.oParams.sIconPosition);
        aWrapperCSS.push("align-items:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sIconVAlign]);
        aIconContainerCSS = [ "padding-" + (g_oALL[sHexOWTId].oDesignData.oParams.sIconPosition=="right" ? "left" : "right") + ":" + g_oALL[sHexOWTId].oDesignData.oParams.nIconMargin + "rem" ];
        nIconHeight = 0.01*g_oALL[sHexOWTId].oDesignData.oParams.nIconSize*OptReal(g_oALL[sHexOWTId].oDesignData.oParams.iIconHeight);
        aIconCSS = [ "background-image:url('pics/default-placeholder.png'); width:" + g_oALL[sHexOWTId].oDesignData.oParams.nIconSize + "rem;min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.nIconSize + "rem;max-width:" + g_oALL[sHexOWTId].oDesignData.oParams.nIconSize + "rem;height:" + nIconHeight + "rem;min-height:" + nIconHeight + "rem;max-height:" + nIconHeight + "rem" ];
        aIconClasses = [ "wt-lp-wheader-icon" ];
        if(g_oALL[sHexOWTId].oDesignData.oParams.bIconHasBG)
        {
            aIconCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sIconColorBG);
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bIconHasBorder)
        {
            aIconCSS.push("border:solid " + g_oALL[sHexOWTId].oDesignData.oParams.iIconBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.sIconColorBorder);
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bIconIsRounded)
        {
            aIconClasses.push("wt-lp-wheader-icon-is-rounded");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.bIconHasShadow)
        {
            aIconClasses.push("wt-lp-wheader-icon-has-shadow");
        }
    }

    var aTxtContainerCSS = [ "align-items:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sAlign] ];

    var aHeaderCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sHeaderFont", sSizePrefix: "largeheader" }), _GetTextShadowCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sHeaderFontShadow" }) ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUppercaseHeader)
    {
        aHeaderCSS.push( "text-transform: uppercase" );
    }

    var aBeforeCSS = [ "padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingBottomPreHeader + "rem" ];
    var aAfterCSS = [ "padding-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingTopSubHeader + "rem" ];

    var aDivider1CSS = [ "background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sDivider1Color + ";min-height:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider1Size + "px;height:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider1Size + "px;max-height:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider1Size + "px;margin-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nDivider1PaddingBottom + "rem" ];
    var aDivider2CSS = [ "background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sDivider2Color + ";min-height:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider2Size + "px;height:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider2Size + "px;max-height:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider2Size + "px;margin-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nDivider2PaddingTop + "rem" ];
    var aPreHeaderCSS = [];
    aPreHeaderCSS.push( tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sPreHeaderFont" }) );
    aPreHeaderCSS.push( _GetTextShadowCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sPreHeaderFontShadow" }) );
    var aSubHeaderCSS = [];
    aSubHeaderCSS.push( tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sSubHeaderFont" }) );
    aSubHeaderCSS.push( _GetTextShadowCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sSubHeaderFontShadow" }) );
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayDivider1)
    {
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sDivider1Type)
        {
            case "preheader":
            {
                aPreHeaderCSS.push("padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingBottomPreHeader + "rem;border-bottom:solid " + g_oALL[sHexOWTId].oDesignData.oParams.iDivider1Size + "px " + g_oALL[sHexOWTId].oDesignData.oParams.sDivider1Color + ";margin-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nDivider1PaddingBottom + "rem");
                break;
            }
            case "header":
            {
                aPreHeaderCSS.push("padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingBottomPreHeader + "rem");
                break;
            }
            case "fixed":
            default:
            {
                aTxtContainerCSS.push("width:100%");
                aHeaderCSS.push("width:100%");
                aDivider1CSS.push("width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider1Width + "%;min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider1Width + "%;max-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider1Width + "%");
                aPreHeaderCSS.push("padding-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingBottomPreHeader + "rem");
                break;
            }
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayDivider2)
    {
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sDivider2Type)
        {
            case "subheader":
            {
                aSubHeaderCSS.push("padding-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingTopSubHeader + "rem;border-top:solid " + g_oALL[sHexOWTId].oDesignData.oParams.iDivider2Size + "px " + g_oALL[sHexOWTId].oDesignData.oParams.sDivider2Color + ";margin-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nDivider2PaddingTop + "rem");
                break;
            }
            case "header":
            {
                aSubHeaderCSS.push("padding-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingTopSubHeader + "rem");
                break;
            }
            case "fixed":
            default:
            {
                aTxtContainerCSS.push("width:100%");
                aHeaderCSS.push("width:100%");
                aDivider2CSS.push("width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider2Width + "%;min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider2Width + "%;max-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iDivider2Width + "%");
                aSubHeaderCSS.push("padding-top:" + g_oALL[sHexOWTId].oDesignData.oParams.nPaddingTopSubHeader + "rem");
                break;
            }
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUppercasePreHeader)
    {
        aPreHeaderCSS.push("text-transform: uppercase");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUppercaseSubHeader)
    {
        aSubHeaderCSS.push("text-transform: uppercase");
    }

    var sDivCSSName = "#WT_" + sHexOWTId;
    var sCSSToAppend = sDivCSSName + " { " + aWorkareaCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wheader-wrapper {" + aWrapperCSS.join(";") + "; }\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayIcon)
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wheader-icon-container {" + aIconContainerCSS.join(";") + "; }\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-wheader-icon {" + aIconCSS.join(";") + "; }\n";
    }
    sCSSToAppend += sDivCSSName + " .wt-lp-wheader-txt-container {" + aTxtContainerCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wheader-before {" + aBeforeCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wheader-preheader-text {" + aPreHeaderCSS.join(";") + "; }\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayDivider1 && g_oALL[sHexOWTId].oDesignData.oParams.sDivider1Type!="preheader")
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wheader-divider-1 {" + aDivider1CSS.join(";") + "; }\n";
    }
    sCSSToAppend += sDivCSSName + " .wt-lp-wheader-header-text {" + aHeaderCSS.join(";") + "; }\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayDivider2 && g_oALL[sHexOWTId].oDesignData.oParams.sDivider2Type!="subheader")
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wheader-divider-1 {" + aDivider2CSS.join(";") + "; }\n";
    }
    sCSSToAppend += sDivCSSName + " .wt-lp-wheader-after {" + aAfterCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wheader-subheader-text {" + aSubHeaderCSS.join(";") + "; }\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle, sPrefix: ".wt-lp-wheader-workarea[wt-id='" + sHexOWTId + "'] " });
    }

    if(g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop!="")
    {
        sHTML += '<a id="' + g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop + '"></a>';
    }
    sHTML += '<div class="' + aWorkareaClasses.join(' ') + '" wt-lazy-block="' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-owt-id="' + sHexOWTId + '" id="WT_' + sHexOWTId + '"';
    if(bLPE)
    {
        sHTML += ' wt-used-context="' + aUsedContext.join(";") + '"';
    }
    sHTML += '>';
    sHTML += '<div class="' + aWrapperClasses.join(' ') + '" wt-role="root">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayIcon)
    {
        sHTML += '<div class="wt-lp-wheader-icon-container" wt-role="icon-container"><div class="' + aIconClasses.join(' ') + '" wt-role="icon"></div></div>';
    }
    sHTML += '<div class="wt-lp-wheader-txt-container">';
    sHTML += '<div class="wt-lp-wheader-before" wt-lazy-item="1" wt-role="pre-body">';
    sHTML += '<div class="wt-lp-wheader-preheader-text" style="' + aPreHeaderCSS.join(';') + '" wt-role="preheader"></div>';
    sHTML += '</div>';
    sHTML += '<div class="wt-lp-wheader-self" wt-lazy-item="2" wt-role="body">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayDivider1 && g_oALL[sHexOWTId].oDesignData.oParams.sDivider1Type!="preheader")
    {
        sHTML += '<div class="wt-lp-wheader-divider wt-lp-wheader-divider-1"></div>';
    }
    sHTML += '<div class="wt-lp-wheader-header-text" wt-role="header"></div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayDivider2 && g_oALL[sHexOWTId].oDesignData.oParams.sDivider2Type!="subheader")
    {
        sHTML += '<div class="wt-lp-wheader-divider wt-lp-wheader-divider-2"></div>';
    }
    sHTML += '</div>';
    sHTML += '<div class="wt-lp-wheader-after" wt-lazy-item="3" wt-role="sub-body">';
    sHTML += '<div class="wt-lp-wheader-subheader-text" wt-role="subheader"></div>';
    sHTML += '</div>';
    sHTML += '</div>';
    sHTML += '</div>';
    sHTML += '</div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sAnchorBottom!="")
    {
        sHTML += '<a id="' + g_oALL[sHexOWTId].oDesignData.oParams.sAnchorBottom + '"></a>';
    }
    sHTML += '<div class="wt-init-vars" style="display: none" wt-role="init-css" id="CSS_' + sHexOWTId + '" wt-id="' + sHexOWTId + '">' + sCSSToAppend + '</div>';
    if(oArgs.bLegacy)
    {
        sHTML += '<script id="LEG_' + sHexOWTId + '">//({'; // empty script tag to pair legacy cached tag
    }

    return sHTML;
}
function _CUSTOM_BuildRuntimeData(oArgs)
{
    var aRuntimeParams =
        [
            { name: "sHeader", var_name: "Header", type: "string", def: "Header" },
            { name: "sSubHeader", var_name: "downHeader", type: "string", def: "" },
            { name: "sPreHeader", var_name: "upHeader", type: "string", def: "" },
            { name: "bDisplayDivider1", var_name: "display_divider1", type: "bool", def: false },
            { name: "bDisplayDivider2", var_name: "display_divider2", type: "bool", def: false },
            { name: "bDisplayIcon", var_name: "display_icon", type: "bool", def: false },
            { name: "sBlockImgLink", var_name: "block_img_link", type: "string", def: "" },
            { name: "sIconType", var_name: "icon_type", type: "string", def: "file" },
            { name: "sIconFile", var_name: "icon_file", type: "string", def: "" },
            { name: "sIconURL", var_name: "icon_url", type: "string", def: "" },
            { name: "sHideIconCondition", var_name: "hide_icon_condition", type: "string", def: "" },
            { name: "bPlaceholderOnHide", var_name: "placeholder_on_hide", type: "bool", def: false },
            { name: "sIconPlaceholderURL", var_name: "hide_icon_placeholder", type: "string", def: "" },
        ];
    g_oALL[sHexOWTId].oRuntimeData =
        {
            sOWTId: sHexOWTId,
            sWTId: sHexWTId,
            oParams: tools_lp.get_owt_params(curParams, aRuntimeParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } )
        };
    var aLegacyRuntimeUpdates =
        [
            { name: "sHideIconCondition", value: "" },
            { name: "bPlaceholderOnHide", value: false },
            { name: "sIconPlaceholderURL", value: "" }
        ];
    if(aLegacyRuntimeUpdates.length>0)
    {
        g_oALL[sHexOWTId].oRuntimeData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oRuntimeData.oParams, aLegacyRuntimeUpdates);
    }
    g_oALL[sHexOWTId].oRuntimeData.bLPE = bLPE;
    return g_oALL[sHexOWTId].oRuntimeData;
}
/* END TEMPLATE-DEPENDING FUNCTIONS */

/************************************************************************************************/
/* START MAIN FLOW (NO COLLECTIONS) */

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

        g_oALL[sHexOWTId].sFullHTML = g_oALL[sHexOWTId].sHTMLData + '})</script><div class="wt-init-vars" style="display: none" wt-role="init-data" id="DAT_' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-constructor="' + g_oALL[sHexOWTId].sConstructor + '">' + UrlEncode16(EncodeJson( oRuntimeToBrowser, { ExportLargeIntegersAsStrings: true } )) + '</div><script id="SCR_' + sHexOWTId + '">$(document).ready(function () { WTLP.Build({ sId: "' + sHexOWTId + '" }) })</script>';

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
