<%
// 6589515242172407367
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false,
        sTemplateName: "BUTTON", // for error msgs
        sBlockPrefix: "block_button", // for common get_web_param calls
        sConstructor: "WTLPButton" // for constructor call
    });

/* TEMPLATE-DEPENDING FUNCTIONS (NO COLLECTION) */
function _CUSTOM_BuildBrowserData(oArgs)
{
    var oBData = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData));
    oBData.oParams.DeleteOptProperty("sActionParams");
    oBData.oParams.DeleteOptProperty("iActionId");
    oBData.oParams.DeleteOptProperty("iCollectionId");
    oBData.oParams.sButtonText = _Substitute({ sText: oBData.oParams.sButtonText });
    oBData.oParams.sButtonURL = _Substitute({ sText: oBData.oParams.sButtonURL });
    oBData.oParams.sBlockImgLink = _Substitute({ sText: oBData.oParams.sBlockImgLink });
    if(oBData.oParams.HasProperty("sMultipleActionsHeader"))
    {
        oBData.oParams.sMultipleActionsHeader = _Substitute({ sText: oBData.oParams.sMultipleActionsHeader });
    }
    tools_lp.update_runtime_env({ oData: oBData });
    return oBData;
}
function _CUSTOM_BuildDesignData(oArgs)
{
    var aDesignParams =
        [
            { name: "bUseBG", var_name: "use_bg", type: "bool", def: true },
            { name: "sButtonBGColor", var_name: "color_bg", type: "string", def: "#4176ea" },
            { name: "sButtonBGColorOver", var_name: "color_bg_over", type: "string", def: "#355bbb" },
            { name: "bShadow", var_name: "use_shadow", type: "bool", def: false },
            { name: "bBorder", var_name: "use_border", type: "bool", def: false },
            { name: "sColorBorder", var_name: "color_border", type: "string", def: "#4176ea" },
            { name: "sColorBorderOver", var_name: "color_border_over", type: "string", def: "#355bbb" },
            { name: "iBorderWidth", var_name: "border_width", type: "int", def: 1 },
            { name: "bIsRounded", var_name: "is_rounded", type: "bool", def: false },
            { name: "nBtnPaddingLeft", var_name: "button_padding_left", type: "real", def: 2 },
            { name: "nBtnPaddingRight", var_name: "button_padding_right", type: "real", def: 2 },
            { name: "nBtnPaddingTop", var_name: "button_padding_top", type: "real", def: 1 },
            { name: "nBtnPaddingBottom", var_name: "button_padding_bottom", type: "real", def: 1 },

            { name: "sFontFamily", var_name: "font_family", type: "string", def: "Roboto" },
            { name: "sFontFamilyCustom", var_name: "font_family_custom", type: "string", def: "" },
            { name: "sFontSize", var_name: "font_size", type: "string", def: "medium" },
            { name: "sFontWeight", var_name: "font_weight", type: "string", def: "normal" },
            { name: "sFontStyle", var_name: "font_style", type: "string", def: "normal" },
            { name: "sFontColor", var_name: "color", type: "string", def: "#ffffff" },
            { name: "sFontColorHover", var_name: "color_over", type: "string", def: "#ffffff" },

            { name: "bBlockHasBG", var_name: "block_has_bg", type: "bool", def: false },
            { name: "sColorBlockBG", var_name: "color_block_bg", type: "string", def: "#ffffff" },
            { name: "sBlockImgBG", var_name: "block_img_bg", type: "string", def: "none" },
            { name: "sBlockImgFile", var_name: "block_img_file", type: "string", def: "" },
            { name: "sBlockImgRepeat", var_name: "block_img_repeat", type: "string", def: "no-repeat" },
            { name: "sBlockImgPosition", var_name: "block_img_position", type: "string", def: "center center" },
            { name: "sBlockImgPositionCustom", var_name: "block_img_position_custom", type: "string", def: "" },
            { name: "sBlockImgSize", var_name: "block_img_size", type: "string", def: "cover" },
            { name: "sBlockImgSizeCustom", var_name: "block_img_size_custom", type: "string", def: "" },
            { name: "bBlockHasBorder", var_name: "block_has_border", type: "bool", def: false },
            { name: "sColorBlockBorder", var_name: "color_block_border", type: "string", def: "#e2e3e4" },
            { name: "iBlockBorderWidth", var_name: "block_border_width", type: "int", def: 1 },
            { name: "bBlockHasShadow", var_name: "block_has_shadow", type: "bool", def: false },
            { name: "bBlockIsRounded", var_name: "block_is_rounded", type: "bool", def: false },
            { name: "nBlockPaddingLeft", var_name: "block_padding_left", type: "real", def: 0 },
            { name: "nBlockPaddingRight", var_name: "block_padding_right", type: "real", def: 0 },
            { name: "nBlockPaddingTop", var_name: "block_padding_top", type: "real", def: 0 },
            { name: "nBlockPaddingBottom", var_name: "block_padding_bottom", type: "real", def: 0 },

            { name: "sActionType", var_name: "action_type", type: "string", def: "url" },
            { name: "sAlign", var_name: "align", type: "string", def: "left" },
            { name: "sImgDefaultPosition", var_name: "default_button_icon_layout", type: "string", def: "none" },
            { name: "sImgLeftDefault", var_name: "default_button_icon_left", type: "string", def: "check" },
            { name: "sImgRightDefault", var_name: "default_button_icon_right", type: "string", def: "check" },
            { name: "sImgDefaultSize", var_name: "icon_size", type: "string", def: "medium" },
            { name: "sImgLeft", var_name: "img_left", type: "int", def: 0 },
            { name: "sImgRight", var_name: "img_right", type: "int", def: 0 }
        ];
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
    g_oALL[sHexOWTId].oDesignData.oParams.sIconClassLeft = oLPParams.icon[g_oALL[sHexOWTId].oDesignData.oParams.sImgLeftDefault];
    g_oALL[sHexOWTId].oDesignData.oParams.sIconClassRight = oLPParams.icon[g_oALL[sHexOWTId].oDesignData.oParams.sImgRightDefault];
    return g_oALL[sHexOWTId].oDesignData;
}
function _CUSTOM_BuildFldsToSub(oArgs)
{
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sBlockImgLink);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sButtonText!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sButtonText);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sButtonURL!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sButtonURL);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sMultipleActionsHeader!="")
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams.sMultipleActionsHeader);
    }
    if(g_oALL[sHexOWTId].oRuntimeData.HasProperty("oActionParams"))
    {
        g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oActionParams);
    }
    return g_oALL[sHexOWTId].aFldsToSub;
}
function _CUSTOM_BuildHTML(oArgs)
{
    var sHTML = "";

    var aWorkareaClasses = [ "wt-lp-wbutton-workarea" ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWorkareaCSS = tools_lp.get_workarea_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });

    var aWrapperClasses = [ "wt-lp-button-wrapper" ];
    AppendBlockClasses({ aTarget: aWrapperClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWrapperCSS = tools_lp.get_block_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });
    aWrapperCSS.push("justify-content:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sAlign]);
    var sWrapperBGAttr = (g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG!="none" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG=="link") ? ' wt-sub-bg="sBlockImgLink"' : '';

    var aBtnClasses = [ "wt-lp-wbutton-btn" ];
    var sBtnTextCSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sFont", bArray: false, bOmitColor: true });
    var sBtnCSS = "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nBtnPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBtnPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBtnPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBtnPaddingLeft + "em;";

    var sCSSToAppendIdle = "";
    var sCSSToAppendHover = "";
    var sCSSToAppendTextIdle = "color: " + g_oALL[sHexOWTId].oDesignData.oParams.sFontColor + ";";
    var sCSSToAppendTextHover = "color: " + g_oALL[sHexOWTId].oDesignData.oParams.sFontColorHover + ";";
    if((g_oALL[sHexOWTId].oDesignData.oParams.bUseBG || g_oALL[sHexOWTId].oDesignData.oParams.bBorder) && g_oALL[sHexOWTId].oDesignData.oParams.bIsRounded)
    {
        aBtnClasses.push("wt-lp-wbutton-btn-rounded");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bUseBG)
    {
        sCSSToAppendIdle += "background-color: " + g_oALL[sHexOWTId].oDesignData.oParams.sButtonBGColor + ";";
        sCSSToAppendHover += "background-color: " + g_oALL[sHexOWTId].oDesignData.oParams.sButtonBGColorOver + ";";
        if(g_oALL[sHexOWTId].oDesignData.oParams.bShadow)
        {
            aBtnClasses.push("wt-lp-wbutton-btn-shadow");
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBorder)
    {
        aBtnClasses.push("wt-lp-wbutton-btn-border");
        sBtnCSS += "border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBorderWidth + "px;";
        sCSSToAppendIdle += "border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBorder + ";";
        sCSSToAppendHover += "border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBorderOver + ";";
    }

    var aIconCSS = [];
    var aIconCSSHover = [];
    var aIconTextCSS = [];
    var aIconLeftClasses = [];
    var aIconLeftTextClasses = [];
    var aIconLeftCustomImgClasses = [];
    var aIconLeftCustomImgCSS = [];
    var aIconRightClasses = [];
    var aIconRightTextClasses = [];
    var aIconRightCustomImgClasses = [];
    var aIconRightCustomImgCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition!="none")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="left" || g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="both")
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!=undefined && g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!=0 && g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!="")
            {
                aIconLeftCustomImgClasses = [ "wt-lp-wbutton-icon-img", "wt-lp-wbutton-icon-img-left" ];
                aIconLeftCustomImgCSS = [ "width:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize] + ";height:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize], "background-image: url('download_file.js?file_id=" + g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft + "')" ];
            }
            else
            {
                aIconLeftClasses = [ "wt-lp-wbutton-icon-default", "wt-lp-wbutton-icon-default-left" ];
                aIconLeftTextClasses = [ "wt-lp-wbutton-icon-default-text", g_oALL[sHexOWTId].oDesignData.oParams.sIconClassLeft ];
                aIconCSS = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontColor + ";font-size:" + oLPParams.iconsize[g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultSize] ];
                aIconCSSHover = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontColorHover ];
                aIconTextCSS = [ "width:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize] + ";height:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize] ];
            }
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="right" || g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="both")
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!=undefined && g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!=0 && g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!="")
            {
                aIconRightCustomImgClasses = [ "wt-lp-wbutton-icon-img", "wt-lp-wbutton-icon-img-right" ];
                aIconRightCustomImgCSS = [ "width:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize] + ";height:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize], "background-image: url('download_file.js?file_id=" + g_oALL[sHexOWTId].oDesignData.oParams.sImgRight + "')" ];
            }
            else
            {
                aIconRightClasses = [ "wt-lp-wbutton-icon-default", "wt-lp-wbutton-icon-default-right" ];
                aIconRightTextClasses = [ "wt-lp-wbutton-icon-default-text", g_oALL[sHexOWTId].oDesignData.oParams.sIconClassRight ];
                if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition!="both")
                {
                    aIconCSS = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontColor + ";font-size:" + oLPParams.iconsize[g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultSize] ];
                    aIconCSSHover = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.sFontColorHover ];
                    aIconTextCSS = [ "width:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize] + ";height:" + oLPParams.headerfontsize[g_oALL[sHexOWTId].oDesignData.oParams.sFontSize] ];
                }
            }
        }
    }

    var sDivCSSName = "#WT_" + sHexOWTId;
    var sCSSToAppend = sDivCSSName + " { " + aWorkareaCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-button-wrapper {" + aWrapperCSS.join(";") + "; }\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition!="none")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="left" || g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="both")
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!=undefined && g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!=0 && g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!="")
            {
                sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-icon-img-left {" + aIconLeftCustomImgCSS.join(";") + "; }\n";
            }
            else
            {
                sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-icon-default-left {" + aIconCSS.join(";") + "; }\n";
                sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-link:not([disabled]):hover .wt-lp-wbutton-icon-default-left {" + aIconCSSHover.join(";") + "; }\n";
                sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-icon-default-left .wt-lp-wbutton-icon-default-text {" + aIconTextCSS.join(";") + "; }\n";
            }
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="right" || g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="both")
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!=undefined && g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!=0 && g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!="")
            {
                sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-icon-img-right {" + aIconRightCustomImgCSS.join(";") + "; }\n";
            }
            else
            {
                sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-icon-default-right {" + aIconCSS.join(";") + "; }\n";
                sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-link:not([disabled]):hover .wt-lp-wbutton-icon-default-right {" + aIconCSSHover.join(";") + "; }\n";
                sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-icon-default-right .wt-lp-wbutton-icon-default-text {" + aIconTextCSS.join(";") + "; }\n";
            }
        }
    }
    sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-btn { " + sCSSToAppendIdle + " }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-btn:hover { " + sCSSToAppendHover + " }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-btn .wt-lp-wbutton-text { " + sCSSToAppendTextIdle + " }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-wbutton-btn:hover .wt-lp-wbutton-text { " + sCSSToAppendTextHover + " }";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle, sPrefix: sDivCSSName + " " });
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
    sHTML += '<div class="wt-template-storage" wt-template-box="' + sHexOWTId + '" id="WT_ST_' + sHexOWTId + '">';
    sHTML += '<a class="wt-lp-wbutton-link" href="javascript: void(0)" wt-role="link">';
    sHTML += '<div class="' + aBtnClasses.join(' ') + '" style="' + sBtnCSS + '">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="left" || g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="both")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!=undefined && g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!=0 && g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!="")
        {
            sHTML += '<icon class="' + aIconLeftCustomImgClasses.join(' ') + '"></icon>';
        }
        else
        {
            sHTML += '<div class="' + aIconLeftClasses.join(' ') + '"><icon class="' + aIconLeftTextClasses.join(' ') + '"></icon></div>';
        }
    }
    sHTML += '<span class="wt-lp-wbutton-text" style="' + sBtnTextCSS + '" wt-role="text"></span>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="right" || g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="both")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!=undefined && g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!=0 && g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!="")
        {
            sHTML += '<icon class="' + aIconRightCustomImgClasses.join(' ') + '"></icon>';
        }
        else
        {
            sHTML += '<div class="' + aIconRightClasses.join(' ') + '"><icon class="' + aIconRightTextClasses.join(' ') + '"></icon></div>';
        }
    }
    sHTML += '</div>';
    sHTML += '</a>';
    sHTML += '<button type="button" class="wt-lp-wbutton-link" wt-role="btn">';
    sHTML += '<div class="' + aBtnClasses.join(' ') + '" style="' + sBtnCSS + '">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="left" || g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="both")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!=undefined && g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!=0 && g_oALL[sHexOWTId].oDesignData.oParams.sImgLeft!="")
        {
            sHTML += '<icon class="' + aIconLeftCustomImgClasses.join(' ') + '"></icon>';
        }
        else
        {
            sHTML += '<div class="' + aIconLeftClasses.join(' ') + '"><icon class="' + aIconLeftTextClasses.join(' ') + '"></icon></div>';
        }
    }
    sHTML += '<span class="wt-lp-wbutton-text" style="' + sBtnTextCSS + '" wt-role="text"></span>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="right" || g_oALL[sHexOWTId].oDesignData.oParams.sImgDefaultPosition=="both")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!=undefined && g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!=0 && g_oALL[sHexOWTId].oDesignData.oParams.sImgRight!="")
        {
            sHTML += '<icon class="' + aIconRightCustomImgClasses.join(' ') + '"></icon>';
        }
        else
        {
            sHTML += '<div class="' + aIconRightClasses.join(' ') + '"><icon class="' + aIconRightTextClasses.join(' ') + '"></icon></div>';
        }
    }
    sHTML += '</div>';
    sHTML += '</button>';

    if(g_oALL[sHexOWTId].oDesignData.oParams.sActionType=="multiple_remote")
    {
        sHTML += '<ul wt-role="multiple-actions" class="wt-lp-wbutton-multiple-actions"></ul>';
        sHTML += '<ul>';
        sHTML += '<li wt-role="multiple-actions-item" class="wt-lp-wbutton-multiple-actions-item"><a class="wt-lp-wbutton-link" href="javascript: void(0)" wt-role="itemlink"></a>';
        sHTML += '</ul>';
    }
    sHTML += '</div>';
    sHTML += '<div class="' + aWrapperClasses.join(' ') + '" ' + sWrapperBGAttr + ' wt-lazy-item="1" wt-role="btn-wrapper"></div>';
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
            { name: "sActionType", var_name: "action_type", type: "string", def: "url" },
            { name: "sImgLeft", var_name: "img_left", type: "int", def: "" },
            { name: "sImgRight", var_name: "img_right", type: "int", def: "" },
            { name: "sImgLeftDefault", var_name: "default_button_icon_left", type: "string", def: "check" },
            { name: "sImgRightDefault", var_name: "default_button_icon_right", type: "string", def: "check" },
            { name: "sImgDefaultPosition", var_name: "default_button_icon_layout", type: "string", def: "none" },

            { name: "sButtonText", var_name: "text", type: "string", def: "" },
            { name: "sButtonURL", var_name: "url", type: "string", def: "" },
            { name: "bCollectFlds", var_name: "collect_flds", type: "bool", def: false },
            { name: "bActionOnKey", var_name: "action_on_key", type: "bool", def: false },
            { name: "sActionKey", var_name: "key", type: "string", def: "enter" },
            { name: "sActionKeyCustom", var_name: "key_custom", type: "string", def: "" },
            { name: "bOverrideNewWindowOnMobile", var_name: "override_new_window_on_mobile", type: "bool", def: false },
            { name: "sRemoteActionType", var_name: "remote_action_type", type: "string", def: "object" },
            { name: "iRemoteActionId", var_name: "__remote_action__", type: "int", def: 0 },
            { name: "iRemoteActionCommonId", var_name: "remote_action_common", type: "int", def: 0 },
            { name: "sLocalAction", var_name: "local_action", type: "string", def: "object" },
            { name: "sNewObjectId", var_name: "new_object_id", type: "string", def: "0" },
            { name: "sFunctionName", var_name: "function_name", type: "string", def: "" },
            { name: "sMultipleActionsHeader", var_name: "multiple_actions_header", type: "string", def: "Select action" },

            { name: "sBlockImgLink", var_name: "block_img_link", type: "string", def: "" },
            { name: "sButtonOpenType", var_name: "open_type", type: "string", def: "blank" },
            { name: "aTargetWidgets", var_name: "target_widgets_list", type: "string", def: "" },
            { name: "bSlideWidgets", var_name: "slide_widgets", type: "bool", def: true },

            { name: "sActionParams", var_name: "__service__remote_action_params", type: "string", def: "" },
            { name: "sCommonActionParams", var_name: "__service__common_remote_action_params", type: "string", def: "" }

        ];
    g_oALL[sHexOWTId].oRuntimeData =
        {
            sOWTId: sHexOWTId,
            sWTId: sHexWTId,
            oParams: tools_lp.get_owt_params(curParams, aRuntimeParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren: [], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } )
        };

    g_oALL[sHexOWTId].oRuntimeData.oParams.sIconClassLeft = oLPParams.icon[g_oALL[sHexOWTId].oRuntimeData.oParams.sImgLeftDefault];
    g_oALL[sHexOWTId].oRuntimeData.oParams.sIconClassRight = oLPParams.icon[g_oALL[sHexOWTId].oRuntimeData.oParams.sImgRightDefault];
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets!="")
    {
        try { g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets = ParseJson(g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets); } catch(e) {}
        if(IsArray(g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets))
        {
            var iInt;
            for(i=0; i<g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets.length; i++)
            {
                iInt = OptInt(g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets[i].__value);
                g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets[i] = ((iInt!=undefined) ? "0x" + StrHexInt(iInt, 16) : g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets[i].__value);
            }
        }
        else
        {
            g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets = [];
        }
    }
    else
    {
        g_oALL[sHexOWTId].oRuntimeData.oParams.aTargetWidgets = [];
    }

    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sActionType=="remote") // legacy parameter value
    {
        g_oALL[sHexOWTId].oRuntimeData.oParams.sActionType = "remote_action";
    }

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

    var aLegacyRuntimeUpdates =
        [
            { name: "bOverrideNewWindowOnMobile", value: false },
            { name: "aTargetWidgets", value: [] },
            { name: "bSlideWidgets", value: true }
        ];
    if(aLegacyRuntimeUpdates.length>0)
    {
        g_oALL[sHexOWTId].oRuntimeData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oRuntimeData.oParams, aLegacyRuntimeUpdates);
    }
    g_oALL[sHexOWTId].oRuntimeData.bLPE = bLPE;

    if(!bLPE)
    {
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.sActionType=="remote_action" && g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId!=0)
        {
            _AppendActionParams({ oData: g_oALL[sHexOWTId].oRuntimeData, iActionId: g_oALL[sHexOWTId].oRuntimeData.oParams.iActionId }); // appends to current g_oALL[sHexOWTId].oRuntimeData
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

    return g_oALL[sHexOWTId].oRuntimeData;
}
/* END TEMPLATE-DEPENDING FUNCTIONS */

/************************************************************************************************/
/* START MAIN FLOW (NO COLLECTION) */

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
        if(g_oALL[sHexOWTId].oDesignData==null)
        {
            g_oALL[sHexOWTId].oDesignData = _CUSTOM_BuildDesignData();
        }
        //if(g_oALL[sHexOWTId].oRuntimeData==null)
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