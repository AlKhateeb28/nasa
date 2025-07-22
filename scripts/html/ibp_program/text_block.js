<%
// 6561728362502425936
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: true,
        sTemplateName: "TEXT", // for error msgs
        sBlockPrefix: "block_text", // for common get_web_param calls
        sConstructor: "WTLPPlainObject" // for constructor call
    });

/* TEMPLATE-DEPENDING FUNCTIONS */
function _CUSTOM_BuildBrowserData(oArgs)
{
    var oBData = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData));
    if(oBData.oParams.bUseImg)
    {
        if(oBData.oParams.sObjectType=="link")
        {
            if(oBData.oParams.sImgLink!="")
            {
                oBData.oParams.sImgLink = _Substitute({ sText: oBData.oParams.sImgLink });
            }
            else
            {
                oBData.oParams.sImgLink = "/pics/default-placeholder.png";
            }
        }
        else
        {
            oBData.oParams.sImgLink = (oBData.oParams.sImgFile=="") ? "pics/default-placeholder.png" : "download_file.html?file_id=" + oBData.oParams.sImgFile;
        }
    }
    oBData.oParams.sBlockImgLink = _Substitute({ sText: oBData.oParams.sBlockImgLink });
    oBData.oParams.sHeader = _Substitute({ sText: oBData.oParams.sHeader });
    oBData.oParams.sText = _Substitute({ sText: oBData.oParams.sText });
    tools_lp.update_runtime_env({ oData: oBData });
    return oBData;
}
function _CUSTOM_BuildDesignData(oArgs)
{
    var aDesignParams =
        [
            { name: "sHeaderFontFamily", var_name: "font_family_header", type: "string", def: "Roboto" },
            { name: "sHeaderFontFamilyCustom", var_name: "font_family_custom_header", type: "string", def: "" },
            { name: "sHeaderFontSize", var_name: "font_size_header", type: "string", def: "medium" },
            { name: "sHeaderFontWeight", var_name: "font_weight_header", type: "string", def: "normal" },
            { name: "sHeaderFontStyle", var_name: "font_style_header", type: "string", def: "normal" },
            { name: "sHeaderFontColor", var_name: "color_font_header", type: "string", def: "#999" },
            { name: "sHeaderFontShadow", var_name: "font_shadow_header", type: "string", def: "normal" },
            { name: "sHeaderFontShadowColor", var_name: "color_font_shadow_header", type: "string", def: "#000" },
            { name: "sHeaderFontShadowCustom", var_name: "custom_font_shadow_header", type: "string", def: "" },
            { name: "iHeaderPaddingBottom", var_name: "header_padding_bottom", type: "int", def: 100 },

            { name: "sFontFamily", var_name: "font_family", type: "string", def: "Roboto" },
            { name: "sFontFamilyCustom", var_name: "font_family_custom", type: "string", def: "" },
            { name: "sFontSize", var_name: "font_size", type: "string", def: "medium" },
            { name: "sFontWeight", var_name: "font_weight", type: "string", def: "normal" },
            { name: "sFontStyle", var_name: "font_style", type: "string", def: "normal" },
            { name: "sFontColor", var_name: "color_font", type: "string", def: "#262626" },
            { name: "sFontShadow", var_name: "font_shadow", type: "string", def: "normal" },
            { name: "sFontShadowColor", var_name: "color_font_shadow", type: "string", def: "#000" },
            { name: "sFontShadowCustom", var_name: "custom_font_shadow", type: "string", def: "" },

            { name: "bUseImg", var_name: "use_image", type: "bool", def: false },
            { name: "iImgSize", var_name: "img_size", type: "int", def: 50 },
            { name: "sImgPosition", var_name: "image_position", type: "string", def: "left" },
            { name: "sVerticalAlign", var_name: "vertical_align", type: "string", def: "center" },
            { name: "sObjectType", var_name: "object_type", type: "string", def: "image" },
            { name: "sImgFile", var_name: "img_file", type: "string", def: "" },
            { name: "sImgLink", var_name: "img_link", type: "string", def: "" },
            { name: "sExternalCode", var_name: "external_code", type: "string", def: "" },

            { name: "bBlockHasBG", var_name: "outline", type: "bool", def: false },
            { name: "sColorBlockBG", var_name: "color_bg", type: "string", def: "#FFFFFF" },
            { name: "sBlockImgBG", var_name: "block_img_bg", type: "string", def: "none" },
            { name: "sBlockImgFile", var_name: "block_img_file", type: "string", def: "" },
            { name: "sBlockImgRepeat", var_name: "block_img_repeat", type: "string", def: "no-repeat" },
            { name: "sBlockImgPosition", var_name: "block_img_position", type: "string", def: "center center" },
            { name: "sBlockImgPositionCustom", var_name: "block_img_position_custom", type: "string", def: "" },
            { name: "sBlockImgSize", var_name: "block_img_size", type: "string", def: "cover" },
            { name: "sBlockImgSizeCustom", var_name: "block_img_size_custom", type: "string", def: "" },
            { name: "bBlockHasBorder", var_name: "border", type: "bool", def: false },
            { name: "sColorBlockBorder", var_name: "color_border", type: "string", def: "#c2c3c4" },
            { name: "iBlockBorderWidth", var_name: "border_width", type: "int", def: 1 },
            { name: "bBlockHasShadow", var_name: "shadow", type: "bool", def: false },
            { name: "bBlockIsRounded", var_name: "is_rounded", type: "bool", def: false },
            { name: "nBlockPaddingLeft", var_name: "block_padding_left", type: "real", def: 2 },
            { name: "nBlockPaddingRight", var_name: "block_padding_right", type: "real", def: 2 },
            { name: "nBlockPaddingTop", var_name: "block_padding_top", type: "real", def: 2 },
            { name: "nBlockPaddingBottom", var_name: "block_padding_bottom", type: "real", def: 2 },

            { name: "sHeader", var_name: "header", type: "string", def: "" },
            { name: "sAlign", var_name: "align", type: "string", def: "left" }

        ];
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };

    if(g_oALL[sHexOWTId].oDesignData.oParams.sHeaderFontSize=="")
    {
        g_oALL[sHexOWTId].oDesignData.oParams.sHeaderFontSize = g_oALL[sHexOWTId].oDesignData.oParams.sFontSize;
    }
    g_oALL[sHexOWTId].oDesignData.oParams.sHeaderPaddingBottom = (0.01*g_oALL[sHexOWTId].oDesignData.oParams.iHeaderPaddingBottom) + "em";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sImgPosition=="top" || g_oALL[sHexOWTId].oDesignData.oParams.sImgPosition=="bottom")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.iImgSize>100)
        {
            g_oALL[sHexOWTId].oDesignData.oParams.iImgSize = 100;
        }
    }
    else
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.iImgSize>90)
        {
            g_oALL[sHexOWTId].oDesignData.oParams.iImgSize = 90;
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.iImgSize<10)
    {
        g_oALL[sHexOWTId].oDesignData.oParams.iImgSize = 10;
    }
    g_oALL[sHexOWTId].oDesignData.oParams.sTextAreaWidth = "100%";
    g_oALL[sHexOWTId].oDesignData.oParams.sImgAreaWidth = 0;
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseImg)
    {
        g_oALL[sHexOWTId].oDesignData.oParams.sImgAreaWidth = g_oALL[sHexOWTId].oDesignData.oParams.iImgSize + "%";
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgPosition=="left" || g_oALL[sHexOWTId].oDesignData.oParams.sImgPosition=="right")
        {
            g_oALL[sHexOWTId].oDesignData.oParams.sTextAreaWidth = (100-g_oALL[sHexOWTId].oDesignData.oParams.iImgSize) + "%";
        }
    }

    return g_oALL[sHexOWTId].oDesignData;
}
function _CUSTOM_BuildFldsToSub(oArgs)
{
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sHeader!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sHeader);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sText!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sText);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.bUseImg)
    {
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.sObjectType=="link")
        {
            if(g_oALL[sHexOWTId].oRuntimeData.oParams.sImgLink=="")
            {
                g_oALL[sHexOWTId].oRuntimeData.oParams.sImgLink = "/pics/default-placeholder.png";
            }
            else
            {
                g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sImgLink);
            }
        }
        else
        {
            g_oALL[sHexOWTId].oRuntimeData.oParams.sImgLink = (g_oALL[sHexOWTId].oRuntimeData.oParams.sImgFile=="") ? "pics/default-placeholder.png" : "download_file.html?file_id=" + g_oALL[sHexOWTId].oRuntimeData.oParams.sImgFile;
        }
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink);
    }
    return g_oALL[sHexOWTId].aFldsToSub;
}
function _CUSTOM_BuildHTML(oArgs)
{
    var sHTML = "";

    var aWorkareaClasses = [ "wt-lp-workarea", "wt-lp-wtext-workarea" ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: oArgs.oParams });
    var aWorkareaCSS = _GetWorkareaCSS({ oParams: oArgs.oParams, bArray: true });
    aWorkareaCSS.push("text-align:" + oArgs.oParams.sAlign);

    var aImgAreaClasses = [ "wt-lp-wtext-img-area" ];
    if(oArgs.oParams.bUseImg)
    {
        aImgAreaClasses.push("wt-lp-wtext-img-area-" + oArgs.oParams.sImgPosition);
    }
    var aImgAreaCSS = [ "width:" + oArgs.oParams.sImgAreaWidth + ";min-width:" + oArgs.oParams.sImgAreaWidth + ";max-width:" + oArgs.oParams.sImgAreaWidth ];

    var aTextAreaClasses = [ "wt-lp-wtext-area", ("wt-lp-wtext-area-valign-" + oArgs.oParams.sVerticalAlign) ];
    var aTextAreaCSS = [];

    var aHeaderClasses = [ "wt-lp-wtext-header" ];
    var aHeaderCSS = [ _GetFontCSS({ oParams: oArgs.oParams, sPrefix: "sHeaderFont", sSizePrefix: "header" }), ("padding: 0 0 " + oArgs.oParams.sHeaderPaddingBottom + " 0"), _GetTextShadowCSS({ oParams: oArgs.oParams, sPrefix: "sHeaderFontShadow" }) ];

    var aTextClasses = [ "wt-lp-wtext-text" ];
    var aTextCSS = [ _GetFontCSS({ oParams: oArgs.oParams, sPrefix: "sFont" }), _GetTextShadowCSS({ oParams: oArgs.oParams, sPrefix: "sFontShadow" }) ];

    var aWrapperClasses = [ "wt-lp-wrapper" ];
    AppendBlockClasses({ aTarget: aWrapperClasses, oParams: oArgs.oParams });
    var aWrapperCSS = _GetBlockCSS({ oParams: oArgs.oParams, bArray: true });
    var sWrapperBGAttr = (oArgs.oParams.bBlockHasBG && oArgs.oParams.sBlockImgBG!="none" && oArgs.oParams.sBlockImgBG=="link") ? '' : ' wt-sub-bg="sBlockImgLink"';
    if(oArgs.oParams.bUseImg)
    {
        switch(oArgs.oParams.sImgPosition)
        {
            case "top":
            {
                aWrapperClasses.push("wt-lp-workarea-flex-column");
                break;
            }
            case "bottom":
            {
                aWrapperClasses.push("wt-lp-workarea-flex-column-reverse");
                break;
            }
            case "right":
            {
                aWrapperClasses.push("wt-lp-workarea-flex-row-reverse");
                break;
            }
            case "left":
            default:
            {
                aWrapperClasses.push("wt-lp-workarea-flex-row");
                break;
            }
        }
    }
    var aImgClasses = [ "wt-lp-wtext-img" ];
    var aImgCSS = [];
    if(oArgs.oParams.bUseImg && !oArgs.oParams.bBlockHasBG && !oArgs.oParams.bBlockHasBorder)
    {
        if(oArgs.oParams.bBlockIsRounded)
        {
            aImgClasses.push("wt-lp-wtext-rounded");
        }
        if(oArgs.oParams.bBlockHasShadow)
        {
            aImgClasses.push("wt-lp-wtext-shadow");
        }
    }

    var sDivCSSName = "#WT_" + sHexOWTId;
    var sCSSToAppend = sDivCSSName + " { " + aWorkareaCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wrapper {" + aWrapperCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wtext-header {" + aHeaderCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wtext-text { " + aTextCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " div, " + sDivCSSName + " p, " + sDivCSSName + " span, " + sDivCSSName + " a, " + sDivCSSName + " li { font-family:" + (oArgs.oParams.sFontFamily=="Custom" ? oArgs.oParams.sFontFamilyCustom : oLPParams.fontfamily[oArgs.oParams.sFontFamily]) + "; }\n";
    if(oArgs.oParams.bUseImg)
    {
        sCSSToAppend += sDivCSSName + " .wt-lp-wtext-img-area { " + aImgAreaCSS.join(";") + "; }\n";
    }
    if(oArgs.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: oArgs.oParams.sCustomCSSStyle, sPrefix: ".wt-lp-wtext-workarea[wt-id='" + sHexOWTId + "'] " });
    }

    if(oArgs.oParams.sAnchorTop!="")
    {
        sHTML += '<a id="' + oArgs.oParams.sAnchorTop + '"></a>';
    }
    sHTML += '<div class="' + aWorkareaClasses.join(' ') + '" wt-lazy-block="' + sHexOWTId + '" wt-id="' + sHexOWTId + '" wt-owt-id="' + sHexOWTId + '" id="WT_' + sHexOWTId + '"';
    if(bLPE)
    {
        sHTML += ' wt-used-context="' + aUsedContext.join(";") + '"';
    }
    sHTML += '>';
    sHTML += '<div class="' + aWrapperClasses.join(' ') + '" ' + sWrapperBGAttr + '>';
    if(oArgs.oParams.bUseImg)
    {
        sHTML += '<div class="' + aImgAreaClasses.join(' ') + '" wt-lazy-item="1">';
        if(oArgs.oParams.sObjectType=="code")
        {
            sHTML += oArgs.oParams.sExternalCode;
        }
        else
        {
            sHTML += '<img class="' + aImgClasses.join(' ') + '" wt-sub-attr="wt-lazy-src|sImgLink"/>';
        }
        sHTML += '</div>';
    }
    sHTML += '<div class="' + aTextAreaClasses.join(' ') + '" wt-owt-id="' + sHexOWTId + '" wt-lazy-item="2">';
    if(oArgs.oParams.sHeader!="")
    {
        sHTML += '<div class="' + aHeaderClasses.join(' ') + '" wt-sub-html="sHeader"></div>';
    }
    sHTML += '<div class="' + aTextClasses.join(' ') + '" wt-sub-rtf="sText"></div>';
    sHTML += '</div>';
    sHTML += '</div>';
    sHTML += '</div>';
    if(oArgs.oParams.sAnchorBottom!="")
    {
        sHTML += '<a id="' + oArgs.oParams.sAnchorBottom + '"></a>';
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
            { name: "sHeader", var_name: "header", type: "string", def: "" },
            { name: "sText", var_name: "rtf_text", type: "string", def: "" },
            { name: "bUseImg", var_name: "use_image", type: "bool", def: false },
            { name: "sObjectType", var_name: "object_type", type: "string", def: "image" },
            { name: "sImgFile", var_name: "img_file", type: "string", def: "" },
            { name: "sExternalCode", var_name: "external_code", type: "string", def: "" },
            { name: "sImgLink", var_name: "img_link", type: "string", def: "" },
            { name: "sBlockImgLink", var_name: "block_img_link", type: "string", def: "" }
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
