<%
// 6769900896653832444
var g_iStart = GetCurTicks();

Server.Execute( "lpe_common_header.bs" );

COMMON_InitAllObj(
    {
        bPlainWidget: false,
        sTemplateName: "ITEMLIST", // for error msgs
        sBlockPrefix: "block_itemlist", // for common get_web_param calls
        sConstructor: "WTLPItemList" // for constructor call
    });

/* TEMPLATE-DEPENDING FUNCTIONS (HAS COLLECTION) */
function _CUSTOM_BuildBrowserData(oArgs)
{
    var oBData = ParseJson(EncodeJson(g_oALL[sHexOWTId].oRuntimeData));
    oBData.bRefresh = bRefresh;
    var aRuntimeParamsToDelete = [ "iActionId", "iCollectionId", "sActionParams" ];
    for(i=0; i<aRuntimeParamsToDelete.length; i++)
    {
        oBData.oParams.DeleteOptProperty(aRuntimeParamsToDelete[i]);
    }
    for(oElem in oBData.aItems)
    {
        if(oBData.oParams.oItem.bDisplayImg && oElem.image!="")
        {
            oElem.image = _Substitute({ sText: oElem.image });
            try { oElem.image = "download_file.js?file_id=" + Int(oElem.image); } catch (e) {}
        }
        if(oElem.header!="")
        {
            oElem.header = _Substitute({ sText: oElem.header });
        }
        if(oElem.rtf_text!="")
        {
            oElem.rtf_text = _Substitute({ sText: oElem.rtf_text });
        }
        if(oElem.main_url!="")
        {
            oElem.main_url = _Substitute({ sText: oElem.main_url });
        }
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayPreHeader==true && oElem.HasProperty("preheader") && oElem.preheader!="")
        {
            oElem.preheader = _Substitute({ sText: oElem.preheader });
        }
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplaySubHeader1==true && oElem.HasProperty("subheader1") && oElem.subheader1!="")
        {
            oElem.subheader1 = _Substitute({ sText: oElem.subheader1 });
        }
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplaySubHeader2==true && oElem.HasProperty("subheader2") && oElem.subheader2!="")
        {
            oElem.subheader2 = _Substitute({ sText: oElem.subheader2 });
        }
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayBtn1==true)
        {
            if(oElem.button_text1!="")
            {
                oElem.button_text1 = _Substitute({ sText: oElem.button_text1 });
            }
            if(oElem.button_url1!="")
            {
                oElem.button_url1 = _Substitute({ sText: oElem.button_url1 });
            }
        }
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayBtn2==true)
        {
            if(oElem.button_text2!="")
            {
                oElem.button_text2 = _Substitute({ sText: oElem.button_text2 });
            }
            if(oElem.button_url2!="")
            {
                oElem.button_url2 = _Substitute({ sText: oElem.button_url2 });
            }
        }
        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayFloater==true)
        {
            if(oElem.floater!="")
            {
                oElem.floater = _Substitute({ sText: oElem.floater });
            }
            if(oElem.floater_class!="")
            {
                oElem.floater_class = _Substitute({ sText: oElem.floater_class });
            }
            if(oElem.floater_color!="")
            {
                oElem.floater_color = _Substitute({ sText: oElem.floater_color });
            }
        }
    }
    if(oBData.oParams.HasProperty("sFunctionName") && oBData.oParams.sFunctionName!="")
    {
        oBData.oParams.sFunctionName = _Substitute({ sText: oBData.oParams.sFunctionName });
    }
    if(oBData.oParams.HasProperty("sMultipleActionsHeader") && oBData.oParams.sMultipleActionsHeader!="")
    {
        oBData.oParams.sMultipleActionsHeader = _Substitute({ sText: oBData.oParams.sMultipleActionsHeader });
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sRemoteActionType=="object" && oBData.oParams.HasProperty("sActionParams") && oBData.oParams.sActionParams!="")
    {
        oBData.oParams.sActionParams = _Substitute({ sText: oBData.oParams.sActionParams });
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sRemoteActionType=="common" && oBData.oParams.HasProperty("sCommonActionParams") && oBData.oParams.sCommonActionParams!="")
    {
        oBData.oParams.sCommonActionParams = _Substitute({ sText: oBData.oParams.sCommonActionParams });
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sWhenEmpty=="msg" && oBData.oParams.sMsgEmpty!="")
    {
        oBData.oParams.sMsgEmpty = _Substitute({ sText: oBData.oParams.sMsgEmpty });
    }
    if(oBData.oParams.HasProperty("sTextMore") && oBData.oParams.sTextMore!="")
    {
        oBData.oParams.sTextMore = _Substitute({ sText: oBData.oParams.sTextMore });
    }
    if(oBData.oParams.HasProperty("sBlockImgLink") && oBData.oParams.sBlockImgLink!="")
    {
        oBData.oParams.sBlockImgLink = _Substitute({ sText: oBData.oParams.sBlockImgLink });
    }
    if(oBData.oParams.HasProperty("sBlockHeaderText") && oBData.oParams.sBlockHeaderText!="")
    {
        oBData.oParams.sBlockHeaderText = _Substitute({ sText: oBData.oParams.sBlockHeaderText });
    }
    if(oBData.oParams.HasProperty("sLinkHeaderURL") && oBData.oParams.sLinkHeaderURL!="")
    {
        oBData.oParams.sLinkHeaderURL = _Substitute({ sText: oBData.oParams.sLinkHeaderURL });
    }
    if(oBData.oParams.HasProperty("sLinkHeaderText") && oBData.oParams.sLinkHeaderText!="")
    {
        oBData.oParams.sLinkHeaderText = _Substitute({ sText: oBData.oParams.sLinkHeaderText });
    }
    if(oBData.oParams.HasProperty("sLinkFooterURL") && oBData.oParams.sLinkFooterURL!="")
    {
        oBData.oParams.sLinkFooterURL = _Substitute({ sText: oBData.oParams.sLinkFooterURL });
    }
    if(oBData.oParams.HasProperty("sLinkFooterText") && oBData.oParams.sLinkFooterText!="")
    {
        oBData.oParams.sLinkFooterText = _Substitute({ sText: oBData.oParams.sLinkFooterText });
    }
    if(oBData.oParams.HasProperty("sImgURLSuffix") && oBData.oParams.sImgURLSuffix!="")
    {
        oBData.oParams.sImgURLSuffix = _Substitute({ sText: oBData.oParams.sImgURLSuffix });
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayBtn1==true && oBData.oParams.oBtn1.sBtnText!="")
    {
        oBData.oParams.oBtn1.sBtnText = _Substitute({ sText: oBData.oParams.oBtn1.sBtnText });
    }
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayBtn2==true && oBData.oParams.oBtn2.sBtnText!="")
    {
        oBData.oParams.oBtn2.sBtnText = _Substitute({ sText: oBData.oParams.oBtn2.sBtnText });
    }
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
    g_oALL[sHexOWTId].oRuntimeData.oParams.iPageIndex = OptInt(Request.Query.GetOptProperty("pageindex", 1));
    g_oALL[sHexOWTId].oRuntimeData.oCollectionParams = {};
    g_oALL[sHexOWTId].oRuntimeData.oPaging = undefined;
    g_oALL[sHexOWTId].oRuntimeData.sDistincts = undefined;
    var sFilters;
    var sSearch;
    var teFilterObj;
    var oFilterConfig;
    var sDistincts = "";
    if(g_oALL[sHexOWTId].oRuntimeData.oParams.bDataExternal && g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId!=0)
    {
        g_oALL[sHexOWTId].oRuntimeData.aItems = [];

        COMMON_FillCollectionParams();

        if(!bLPE && g_oALL[sHexOWTId].oRuntimeData.oParams.sLoadingType=="server" && g_oALL[sHexOWTId].oRuntimeData.oParams.bDeferredLoading && !bRefresh)
        {
            g_oALL[sHexOWTId].oRuntimeData.iTotal = 0;
            g_oALL[sHexOWTId].oRuntimeData.bFirstLoad = true;
            if(g_bFCache)
            {
                sFilters = "";
                sSearch = "";
                teFilterObj = _GetFilter();
                g_oALL[sHexOWTId].oRuntimeData.sFilters = "{}";
                if(teFilterObj!=null)
                {
                    g_oALL[sHexOWTId].oRuntimeData.sHexFilterId = "0x" + StrHexInt(teFilterObj.id, 16);
                    try
                    {
                        var aFilters = [];
                        oFilterConfig = ParseJson(teFilterObj.wvars.ObtainChildByKey( "block_filters.filters_config" ).value);
                        if(oFilterConfig.HasProperty("defaults"))
                        {
                            if(oFilterConfig.defaults.HasProperty("search"))
                            {
                                sSearch = oFilterConfig.defaults.search;
                                if(sSearch!="")
                                {
                                    aFilters.push({ "id":["name"],"type":"search","value":sSearch });
                                }
                            }
                            if(oFilterConfig.defaults.HasProperty("filters"))
                            {
                                for(i=0; i<oFilterConfig.defaults.filters.length; i++)
                                {
                                    aFilters.push(oFilterConfig.defaults.filters[i]);
                                }
                            }
                            sFilters = EncodeJson(aFilters);
                            g_oALL[sHexOWTId].oRuntimeData.sFilters = sFilters;
                        }
                    }
                    catch(e) { alert (e);}
                }
                g_oALL[sHexOWTId].oRuntimeData.oPaging =
                    {
                        bPaging: (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="row" || g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="page"),
                        bServerSide: (g_oALL[sHexOWTId].oRuntimeData.oParams.sLoadingType=="server"),
                        iPageSize: (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="page" ? (g_oALL[sHexOWTId].oRuntimeData.oParams.iRowsInPage*g_oALL[sHexOWTId].oRuntimeData.oParams.iItemsInRow) : (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="row" ? (g_oALL[sHexOWTId].oRuntimeData.oParams.iRowsInPart*g_oALL[sHexOWTId].oRuntimeData.oParams.iItemsInRow) : 100)),
                        iPageIndex: 1
                    };

                if(g_oALL[sHexOWTId].oRuntimeData.oParams.sDistincts!="")
                {
                    g_oALL[sHexOWTId].oRuntimeData.sDistincts = _Distincts({ sDistincts: g_oALL[sHexOWTId].oRuntimeData.oParams.sDistincts });
                }
            }
        }
        else
        {
            g_oALL[sHexOWTId].oRuntimeData.bFirstLoad = false;

            g_oALL[sHexOWTId].aFldsToSub = [ EncodeJson(g_oALL[sHexOWTId].aColVars, { ExportLargeIntegersAsStrings: true } ) ];
            if(!g_bFCache)
            {
                if(g_oALL[sHexOWTId].oRuntimeData.oParams.sDistincts!="")
                {
                    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="none" || ((g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="row" || g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="page") && g_oALL[sHexOWTId].oRuntimeData.oParams.iPageIndex==1))
                    {
                        sDistincts = _Distincts({ sDistincts: g_oALL[sHexOWTId].oRuntimeData.oParams.sDistincts });
                    }
                }

                sFilters = "";
                sSearch = "";
                teFilterObj = _GetFilter();
                if(g_oALL[sHexOWTId].oRuntimeData.oParams.sLoadingType=="server")
                {
                    var bFirstPartRequest = (Request.Query.GetOptProperty("firstreq", "")=="1") || (!g_oALL[sHexOWTId].oRuntimeData.oParams.bDeferredLoading && !bRefresh);
                    if((g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="none" && !bRefresh) || bFirstPartRequest) // looking for filter widget for
                    {
                        if(teFilterObj!=null)
                        {
                            g_oALL[sHexOWTId].oRuntimeData.sHexFilterId = "0x" + StrHexInt(teFilterObj.id, 16);
                            try
                            {
                                var aFilters = [];
                                oFilterConfig = ParseJson(teFilterObj.wvars.ObtainChildByKey( "block_filters.filters_config" ).value);
                                if(oFilterConfig.HasProperty("defaults"))
                                {
                                    if(oFilterConfig.defaults.HasProperty("search"))
                                    {
                                        sSearch = oFilterConfig.defaults.search;
                                        if(sSearch!="")
                                        {
                                            aFilters.push({ "id":["name"],"type":"search","value":sSearch });
                                        }
                                    }
                                    if(oFilterConfig.defaults.HasProperty("filters"))
                                    {
                                        for(i=0; i<oFilterConfig.defaults.filters.length; i++)
                                        {
                                            aFilters.push(oFilterConfig.defaults.filters[i]);
                                        }
                                    }
                                    sFilters = EncodeJson(aFilters);
                                    g_oALL[sHexOWTId].oRuntimeData.sFilters = sFilters;
                                }
                            }
                            catch(e) { alert (e);}
                        }
                    }
                    else
                    {
                        sFilters = Request.Query.GetOptProperty("filters", "");
                        sSearch = Request.Query.GetOptProperty("search", "");
                    }
                }
                else
                {
                    if(teFilterObj!=null)
                    {
                        g_oALL[sHexOWTId].oRuntimeData.sHexFilterId = "0x" + StrHexInt(teFilterObj.id, 16);
                        try
                        {
                            oFilterConfig = ParseJson(teFilterObj.wvars.ObtainChildByKey( "block_filters.filters_config" ).value);
                            g_oALL[sHexOWTId].oRuntimeData.oFilterConfig = oFilterConfig;
                        }
                        catch(e) { alert (e); }
                    }
                }
                var oResult = _EvalCollection(
                    {
                        oData: g_oALL[sHexOWTId].oRuntimeData,
                        aChildVars: g_oALL[sHexOWTId].aColVars,
                        iCollectionId: g_oALL[sHexOWTId].oRuntimeData.oParams.iCollectionId,
                        bPaging: (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="row" || g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="page"),
                        bServerSide: (g_oALL[sHexOWTId].oRuntimeData.oParams.sLoadingType=="server"),
                        iPageSize: (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="page" ? (g_oALL[sHexOWTId].oRuntimeData.oParams.iRowsInPage*g_oALL[sHexOWTId].oRuntimeData.oParams.iItemsInRow) : (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="row" ? (g_oALL[sHexOWTId].oRuntimeData.oParams.iRowsInPart*g_oALL[sHexOWTId].oRuntimeData.oParams.iItemsInRow) : 100)),
                        iPageIndex: g_oALL[sHexOWTId].oRuntimeData.oParams.iPageIndex,
                        sDistincts: sDistincts,
                        sFilters: sFilters,
                        sSearch: sSearch
                    });
                var iInt;
                if(oResult.HasProperty("result") && IsArray(oResult.result))
                {
                    g_oALL[sHexOWTId].oRuntimeData.aResult = oResult.result;
                    if(oResult.HasProperty("data"))
                    {
                        if(oResult.data.HasProperty("distincts"))
                        {
                            g_oALL[sHexOWTId].oRuntimeData.oDistincts = oResult.data.distincts;
                        }
                    }
                    g_oALL[sHexOWTId].oRuntimeData.iTotal = oResult.total;
                    var iCnt = 0;
                    for(oElem in oResult.result)
                    {
                        iInt = OptInt(oElem.id);
                        oElem.hex_id = ((iInt!=undefined) ? "0x" + StrHexInt(iInt, 16) : oElem.id);
                        g_oALL[sHexOWTId].oRuntimeData.aItems.push(
                            {
                                id: String(oElem.id),
                                hex_id: oElem.hex_id,
                                header: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sHeader", sParam: "header" }),
                                rtf_text: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sRtfText", sParam: "rtf_text" }),
                                main_url: _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sMainURL", sParam: "main_url" })
                            });
                        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayImg==true)
                        {
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].image = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sImage", sParam: "image" });
                        }
                        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayPreHeader==true)
                        {
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].preheader = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sPreheader", sParam: "preheader" });
                        }
                        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplaySubHeader1==true)
                        {
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].subheader1 = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sSubheader1", sParam: "subheader1" });
                        }
                        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplaySubHeader2==true)
                        {
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].subheader2 = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sSubheader2", sParam: "subheader2" });
                        }
                        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayBtn1==true)
                        {
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].button_text1 = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sButtonText1", sParam: "button_text1" });
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].button_url1 = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sButtonURL1", sParam: "button_url1" });
                        }
                        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayBtn2==true)
                        {
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].button_text2 = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sButtonText2", sParam: "button_text2" });
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].button_url2 = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sButtonURL2", sParam: "button_url2" });
                        }
                        if(g_oALL[sHexOWTId].oRuntimeData.oParams.oItem.bDisplayFloater==true)
                        {
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].floater = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sFloater", sParam: "floater" });
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].floater_class = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sFloaterClass", sParam: "css_floater" });
                            g_oALL[sHexOWTId].oRuntimeData.aItems[iCnt].floater_color = _MapItemParam({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, oElem: oElem, sMapParam: "sFloaterColor", sParam: "floater_color" });
                        }
                        iCnt++;
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
            else
            { // default filters
                sFilters = "";
                sSearch = "";
                teFilterObj = _GetFilter();
                g_oALL[sHexOWTId].oRuntimeData.sFilters = "{}";
                if(teFilterObj!=null)
                {
                    g_oALL[sHexOWTId].oRuntimeData.sHexFilterId = "0x" + StrHexInt(teFilterObj.id, 16);
                    try
                    {
                        var aFilters = [];
                        oFilterConfig = ParseJson(teFilterObj.wvars.ObtainChildByKey( "block_filters.filters_config" ).value);
                        g_oALL[sHexOWTId].oRuntimeData.oFilterConfig = oFilterConfig;
                        if(oFilterConfig.HasProperty("defaults"))
                        {
                            if(oFilterConfig.defaults.HasProperty("search"))
                            {
                                sSearch = oFilterConfig.defaults.search;
                                if(sSearch!="")
                                {
                                    aFilters.push({ "id":["name"],"type":"search","value":sSearch });
                                }
                            }
                            if(oFilterConfig.defaults.HasProperty("filters"))
                            {
                                for(i=0; i<oFilterConfig.defaults.filters.length; i++)
                                {
                                    aFilters.push(oFilterConfig.defaults.filters[i]);
                                }
                            }
                            sFilters = EncodeJson(aFilters);
                            g_oALL[sHexOWTId].oRuntimeData.sFilters = sFilters;
                        }
                    }
                    catch(e) { alert (e);}
                }
                if(!bLPE && g_oALL[sHexOWTId].oRuntimeData.oParams.sLoadingType=="server" && !g_oALL[sHexOWTId].oRuntimeData.oParams.bDeferredLoading && !bRefresh) // initial paging for undeferred server loading
                {
                    g_oALL[sHexOWTId].oRuntimeData.oPaging =
                        {
                            bPaging: (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="row" || g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="page"),
                            bServerSide: (g_oALL[sHexOWTId].oRuntimeData.oParams.sLoadingType=="server"),
                            iPageSize: (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="page" ? (g_oALL[sHexOWTId].oRuntimeData.oParams.iRowsInPage*g_oALL[sHexOWTId].oRuntimeData.oParams.iItemsInRow) : (g_oALL[sHexOWTId].oRuntimeData.oParams.sDisplayType=="row" ? (g_oALL[sHexOWTId].oRuntimeData.oParams.iRowsInPart*g_oALL[sHexOWTId].oRuntimeData.oParams.iItemsInRow) : 100)),
                            iPageIndex: 1
                        };

                    if(g_oALL[sHexOWTId].oRuntimeData.oParams.sDistincts!="")
                    {
                        g_oALL[sHexOWTId].oRuntimeData.sDistincts = _Distincts({ sDistincts: g_oALL[sHexOWTId].oRuntimeData.oParams.sDistincts });
                    }

                }
            }
        }
    }
    else
    {
        // user-filled array comes from runtime data
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
            { name: "nItemMarginBottom", var_name: "item_margin_bottom", type: "real", def: 2 },
            { name: "sDisplayType", var_name: "display_type", type: "string", def: "none" },
            { name: "iItemsInRow", var_name: "items_in_row", type: "int", def: 1 },
            { name: "sItemAlign", var_name: "item_align", type: "string", def: "left" },

            { name: "bDisplayBlockHeader", var_name: "display_block_header", type: "bool", def: false },
            { name: "sBlockHeaderFontFamily", var_name: "font_family_block_header", type: "string", def: "Roboto" },
            { name: "sBlockHeaderFontFamilyCustom", var_name: "font_family_block_header_custom", type: "string", def: "" },
            { name: "sBlockHeaderFontSize", var_name: "font_size_block_header", type: "string", def: "large" },
            { name: "sBlockHeaderFontWeight", var_name: "font_weight_block_header", type: "string", def: "bold" },
            { name: "sBlockHeaderFontStyle", var_name: "font_style_block_header", type: "string", def: "normal" },
            { name: "sBlockHeaderFontColor", var_name: "color_font_block_header", type: "string", def: "#151D2D" },
            { name: "sBlockHeaderLayout", var_name: "block_header_layout", type: "string", def: "title-btns" },
            { name: "sBlockHeaderBGType", var_name: "block_header_bg_type", type: "string", def: "none" },
            { name: "sBlockHeaderBGColor", var_name: "color_block_header_bg", type: "string", def: "#c2c3c4" },
            { name: "bBlockHeaderIsRounded", var_name: "block_header_bg_is_rounded", type: "bool", def: false },
            { name: "sBlockHeaderBorderType", var_name: "block_header_border_type", type: "string", def: "none" },
            { name: "sBlockHeaderBorderColor", var_name: "color_block_header_border", type: "string", def: "#c2c3c4" },
            { name: "iBlockHeaderBorderWidth", var_name: "block_header_border_width", type: "int", def: 1 },
            { name: "bBlockHeaderBorderBottomOnly", var_name: "block_header_border_bottom_only", type: "bool", def: true },
            { name: "nBlockHeaderPaddingLeft", var_name: "block_header_padding_left", type: "real", def: 1 },
            { name: "nBlockHeaderPaddingRight", var_name: "block_header_padding_right", type: "real", def: 1 },
            { name: "nBlockHeaderPaddingTop", var_name: "block_header_padding_top", type: "real", def: 1 },
            { name: "nBlockHeaderPaddingBottom", var_name: "block_header_padding_bottom", type: "real", def: 1 },
            { name: "bDisplayHeaderTotal", var_name: "display_header_total", type: "bool", def: false },
            { name: "sColorHeaderTotalBG", var_name: "color_header_total_bg", type: "string", def: "#999999" },
            { name: "sColorHeaderTotalFont", var_name: "color_header_total_font", type: "string", def: "#FFFFFF" },
            { name: "sLinkHeaderFontFamily", var_name: "font_family_link_header", type: "string", def: "Roboto" },
            { name: "sLinkHeaderFontFamilyCustom", var_name: "font_family_link_header_custom", type: "string", def: "" },
            { name: "sLinkHeaderFontSize", var_name: "font_size_link_header", type: "string", def: "medium" },
            { name: "sLinkHeaderFontWeight", var_name: "font_weight_link_header", type: "string", def: "normal" },
            { name: "sLinkHeaderFontStyle", var_name: "font_style_link_header", type: "string", def: "normal" },
            { name: "bDisplayBlockFooter", var_name: "display_block_footer", type: "bool", def: false },
            { name: "sBlockFooterLayout", var_name: "block_footer_layout", type: "string", def: "none-btns" },
            { name: "sBlockFooterBGType", var_name: "block_footer_bg_type", type: "string", def: "none" },
            { name: "sBlockFooterBGColor", var_name: "color_block_footer_bg", type: "string", def: "#c2c3c4" },
            { name: "bBlockFooterIsRounded", var_name: "block_footer_bg_is_rounded", type: "bool", def: false },
            { name: "sBlockFooterBorderType", var_name: "block_footer_border_type", type: "string", def: "none" },
            { name: "sBlockFooterBorderColor", var_name: "color_block_footer_border", type: "string", def: "#c2c3c4" },
            { name: "iBlockFooterBorderWidth", var_name: "block_footer_border_width", type: "int", def: 1 },
            { name: "bBlockFooterBorderTopOnly", var_name: "block_footer_border_top_only", type: "bool", def: true },
            { name: "nBlockFooterPaddingLeft", var_name: "block_footer_padding_left", type: "real", def: 1 },
            { name: "nBlockFooterPaddingRight", var_name: "block_footer_padding_right", type: "real", def: 1 },
            { name: "nBlockFooterPaddingTop", var_name: "block_footer_padding_top", type: "real", def: 1 },
            { name: "nBlockFooterPaddingBottom", var_name: "block_footer_padding_bottom", type: "real", def: 1 },
            { name: "sLinkFooterFontFamily", var_name: "font_family_link_footer", type: "string", def: "Roboto" },
            { name: "sLinkFooterFontFamilyCustom", var_name: "font_family_link_footer_custom", type: "string", def: "" },
            { name: "sLinkFooterFontSize", var_name: "font_size_link_footer", type: "string", def: "medium" },
            { name: "sLinkFooterFontWeight", var_name: "font_weight_link_footer", type: "string", def: "normal" },
            { name: "sLinkFooterFontStyle", var_name: "font_style_link_footer", type: "string", def: "normal" },
            { name: "sLinkHeaderURL", var_name: "link_header_url", type: "string", def: "" },
            { name: "sLinkFooterURL", var_name: "link_footer_url", type: "string", def: "" },

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
            { name: "sColorBlockBorder", var_name: "color_block_border", type: "string", def: "#c2c3c4" },
            { name: "iBlockBorderWidth", var_name: "block_border_width", type: "int", def: 1 },
            { name: "bBlockIsRounded", var_name: "block_is_rounded", type: "bool", def: false },
            { name: "bBlockHasShadow", var_name: "block_has_shadow", type: "bool", def: false },
            { name: "nBlockPaddingLeft", var_name: "block_padding_left", type: "real", def: 1 },
            { name: "nBlockPaddingRight", var_name: "block_padding_right", type: "real", def: 1 },
            { name: "nBlockPaddingTop", var_name: "block_padding_top", type: "real", def: 0 },
            { name: "nBlockPaddingBottom", var_name: "block_padding_bottom", type: "real", def: 0 },
            { name: "sItemLinkTarget", var_name: "item_link_target", type: "string", def: "_self" },

            { name: "bAllowMinHeight", var_name: "allow_min_height", type: "bool", def: false },
            { name: "nItemMinHeight", var_name: "item_min_height", type: "real", def: 16 }

        ];
    aDesignParams = ArrayUnion(aDesignParams, aMsgEmptyDesignParams); // typical msg empty params
    aDesignParams = ArrayUnion(aDesignParams, aWorkareaDesignParams); // typical workarea params, anchors, custom css and styles
    var aItemParams =
        [
            { name: "sItemLayout", var_name: "item_layout", type: "string", def: "h_btns_below" },
            { name: "bLayoutHeaderFirst", var_name: "layout_header_first", type: "bool", def: false },
            { name: "nItemPadding", var_name: "item_padding", type: "real", def: 2 },
            { name: "sBtnAlign", var_name: "btn_align", type: "string", def: "right" },
            { name: "sBtnValign", var_name: "btn_valign", type: "string", def: "bottom" },
            { name: "bDisplayImg", var_name: "display_img", type: "bool", def: false },
            { name: "bDisplayPreHeader", var_name: "display_preheader", type: "bool", def: false },
            { name: "bDisplaySubHeader1", var_name: "display_subheader1", type: "bool", def: true },
            { name: "bDisplaySubHeader2", var_name: "display_subheader2", type: "bool", def: false },
            { name: "bDisplayBtn1", var_name: "display_btn1", type: "bool", def: true },
            { name: "bDisplayBtn2", var_name: "display_btn2", type: "bool", def: false },
            { name: "bDisplayFloater", var_name: "display_floater", type: "bool", def: false }
        ];
    var aBodyParams =
        [
            { name: "bItemHasBG", var_name: "item_has_bg", type: "bool", def: true },
            { name: "sColorItemBG", var_name: "color_item_bg", type: "string", def: "#ffffff" },
            { name: "bItemHasShadow", var_name: "item_has_shadow", type: "bool", def: false },
            { name: "bItemHasBorder", var_name: "item_has_border", type: "bool", def: true },
            { name: "sColorItemBorder", var_name: "color_item_border", type: "string", def: "#c2c3c4" },
            { name: "iItemBorderWidth", var_name: "item_border_width", type: "int", def: 1 },
            { name: "bItemIsRounded", var_name: "item_is_rounded", type: "bool", def: false }
        ];
    var aImgParams =
        [
            { name: "sImgAlign", var_name: "img_align", type: "string", def: "center" },
            { name: "nImgMargin", var_name: "img_margin", type: "real", def: 0 },
            { name: "sColorImgBG", var_name: "color_img_bg", type: "string", def: "#c2c3c4" },
            { name: "bImgHasNoMargins", var_name: "img_has_no_margins", type: "bool", def: false },
            { name: "bImgHasShadow", var_name: "img_has_shadow", type: "bool", def: false },
            { name: "bImgIsRounded", var_name: "img_is_rounded", type: "bool", def: false },
            { name: "bRoundImg", var_name: "image_radius", type: "bool", def: false },
            { name: "sImgPosition", var_name: "img_position", type: "string", def: "left" },
            { name: "iImgSize", var_name: "img_size", type: "int", def: 30 },
            { name: "nImgHeight", var_name: "img_height", type: "real", def: 100 }
        ];
    var aPreheaderParams =
        [
            { name: "sPreHeaderAlign", var_name: "preheader_align", type: "string", def: "left" },
            { name: "sPreHeaderFontFamily", var_name: "font_family_preheader", type: "string", def: "Roboto" },
            { name: "sPreHeaderFontFamilyCustom", var_name: "font_family_preheader_custom", type: "string", def: "" },
            { name: "sPreHeaderFontSize", var_name: "font_size_preheader", type: "string", def: "medium" },
            { name: "sPreHeaderFontWeight", var_name: "font_weight_preheader", type: "string", def: "normal" },
            { name: "sPreHeaderFontStyle", var_name: "font_style_preheader", type: "string", def: "normal" },
            { name: "sPreHeaderFontColor", var_name: "color_font_preheader", type: "string", def: "#969EB2" }
        ];
    var aHeaderParams =
        [
            { name: "sHeaderAlign", var_name: "header_align", type: "string", def: "left" },
            { name: "sHeaderFontFamily", var_name: "font_family_header", type: "string", def: "Roboto" },
            { name: "sHeaderFontFamilyCustom", var_name: "font_family_header_custom", type: "string", def: "" },
            { name: "sHeaderFontSize", var_name: "font_size_header", type: "string", def: "medium" },
            { name: "sHeaderFontWeight", var_name: "font_weight_header", type: "string", def: "bold" },
            { name: "sHeaderFontStyle", var_name: "font_style_header", type: "string", def: "normal" },
            { name: "sHeaderFontColor", var_name: "color_font_header", type: "string", def: "#4176ea" }
        ];
    var aSubheader1Params =
        [
            { name: "sSubHeader1Align", var_name: "subheader1_align", type: "string", def: "left" },
            { name: "sSubHeader1FontFamily", var_name: "font_family_subheader1", type: "string", def: "Roboto" },
            { name: "sSubHeader1FontFamilyCustom", var_name: "font_family_subheader1_custom", type: "string", def: "" },
            { name: "sSubHeader1FontSize", var_name: "font_size_subheader1", type: "string", def: "medium" },
            { name: "sSubHeader1FontWeight", var_name: "font_weight_subheader1", type: "string", def: "normal" },
            { name: "sSubHeader1FontStyle", var_name: "font_style_subheader1", type: "string", def: "normal" },
            { name: "sSubHeader1FontColor", var_name: "color_font_subheader1", type: "string", def: "#969EB2" }
        ];
    var aSubheader2Params =
        [
            { name: "sSubHeader2Align", var_name: "subheader2_align", type: "string", def: "left" },
            { name: "sSubHeader2FontFamily", var_name: "font_family_subheader2", type: "string", def: "Roboto" },
            { name: "sSubHeader2FontFamilyCustom", var_name: "font_family_subheader2_custom", type: "string", def: "" },
            { name: "sSubHeader2FontSize", var_name: "font_size_subheader2", type: "string", def: "medium" },
            { name: "sSubHeader2FontWeight", var_name: "font_weight_subheader2", type: "string", def: "normal" },
            { name: "sSubHeader2FontStyle", var_name: "font_style_subheader2", type: "string", def: "normal" },
            { name: "sSubHeader2FontColor", var_name: "color_font_subheader2", type: "string", def: "#969EB2" }
        ];
    var aTextParams =
        [
            { name: "sTextAlign", var_name: "text_align", type: "string", def: "left" },
            { name: "sTextFontFamily", var_name: "font_family_text", type: "string", def: "Roboto" },
            { name: "sTextFontFamilyCustom", var_name: "font_family_text_custom", type: "string", def: "" },
            { name: "sTextFontSize", var_name: "font_size_text", type: "string", def: "medium" },
            { name: "sTextFontWeight", var_name: "font_weight_text", type: "string", def: "normal" },
            { name: "sTextFontStyle", var_name: "font_style_text", type: "string", def: "normal" },
            { name: "sTextFontColor", var_name: "color_font_text", type: "string", def: "#151D2D" }
        ];
    var aBtn1Params =
        [
            { name: "bBtn1HasBG", var_name: "btn1_has_bg", type: "bool", def: true },
            { name: "sColorBtn1BG", var_name: "color_btn1_bg", type: "string", def: "#4176ea" },
            { name: "sColorBtn1BGHover", var_name: "color_btn1_bg_hover", type: "string", def: "#355bbb" },
            { name: "bBtn1HasBorder", var_name: "btn1_has_border", type: "bool", def: false },
            { name: "sColorBtn1Border", var_name: "color_btn1_border", type: "string", def: "#4176ea" },
            { name: "sColorBtn1BorderHover", var_name: "color_btn1_border_hover", type: "string", def: "#355bbb" },
            { name: "iBtn1BorderWidth", var_name: "btn1_border_width", type: "int", def: 2 },
            { name: "sBtn1FontFamily", var_name: "font_family_btn1", type: "string", def: "Roboto" },
            { name: "sBtn1FontFamilyCustom", var_name: "font_family_btn1_custom", type: "string", def: "" },
            { name: "sBtn1FontSize", var_name: "font_size_btn1", type: "string", def: "medium" },
            { name: "sBtn1FontWeight", var_name: "font_weight_btn1", type: "string", def: "bold" },
            { name: "sBtn1FontStyle", var_name: "font_style_btn1", type: "string", def: "normal" },
            { name: "sBtn1FontColor", var_name: "color_btn1_font", type: "string", def: "#ffffff" },
            { name: "sBtn1FontColorHover", var_name: "color_btn1_font_hover", type: "string", def: "#ffffff" },
            { name: "bBtn1IsRounded", var_name: "btn1_is_rounded", type: "bool", def: true },
            { name: "bBtn1HasShadow", var_name: "btn1_has_shadow", type: "bool", def: false },
            { name: "sTarget", var_name: "btn1_target", type: "string", def: "_self" }
        ];
    var aBtn2Params =
        [
            { name: "bBtn2HasBG", var_name: "btn2_has_bg", type: "bool", def: true },
            { name: "sColorBtn2BG", var_name: "color_btn2_bg", type: "string", def: "#4176ea" },
            { name: "sColorBtn2BGHover", var_name: "color_btn2_bg_hover", type: "string", def: "#355bbb" },
            { name: "bBtn2HasBorder", var_name: "btn2_has_border", type: "bool", def: false },
            { name: "sColorBtn2Border", var_name: "color_btn2_border", type: "string", def: "#4176ea" },
            { name: "sColorBtn2BorderHover", var_name: "color_btn2_border_hover", type: "string", def: "#355bbb" },
            { name: "iBtn2BorderWidth", var_name: "btn2_border_width", type: "int", def: 2 },
            { name: "sBtn2FontFamily", var_name: "font_family_btn2", type: "string", def: "Roboto" },
            { name: "sBtn2FontFamilyCustom", var_name: "font_family_btn2_custom", type: "string", def: "" },
            { name: "sBtn2FontSize", var_name: "font_size_btn2", type: "string", def: "medium" },
            { name: "sBtn2FontWeight", var_name: "font_weight_btn2", type: "string", def: "bold" },
            { name: "sBtn2FontStyle", var_name: "font_style_btn2", type: "string", def: "normal" },
            { name: "sBtn2FontColor", var_name: "color_btn2_font", type: "string", def: "#FFFFFF" },
            { name: "sBtn2FontColorHover", var_name: "color_btn2_font_hover", type: "string", def: "#FFFFFF" },
            { name: "bBtn2IsRounded", var_name: "btn2_is_rounded", type: "bool", def: true },
            { name: "bBtn2HasShadow", var_name: "btn2_has_shadow", type: "bool", def: false },
            { name: "sTarget", var_name: "btn2_target", type: "string", def: "_self" }
        ];
    var aFloaterParams =
        [
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
            { name: "bFloaterHasShadow", var_name: "floater_has_shadow", type: "bool", def: false }
        ];
    var aPageBtnParams =
        [
            { name: "sPageBtnPosition", var_name: "page_btn_position", type: "string", def: "both" },
            { name: "bPageBtnHasBG", var_name: "page_btn_has_bg", type: "bool", def: true },
            { name: "sColorPageBtnBG", var_name: "color_page_btn", type: "string", def: "#ffffff" },
            { name: "sColorPageBtnBGHover", var_name: "color_page_btn_hover", type: "string", def: "#355bbb" },
            { name: "sColorPageBtnBGSelected", var_name: "color_page_btn_selected", type: "string", def: "#4176ea" },
            { name: "bPageBtnHasBorder", var_name: "page_btn_has_border", type: "bool", def: false },
            { name: "sColorPageBtnBorder", var_name: "color_page_btn_border", type: "string", def: "#4176ea" },
            { name: "sColorPageBtnBorderHover", var_name: "color_page_btn_border_hover", type: "string", def: "#355bbb" },
            { name: "sColorPageBtnBorderSelected", var_name: "color_page_btn_border_selected", type: "string", def: "#4176ea" },
            { name: "sColorPageBtnFont", var_name: "color_page_btn_font", type: "string", def: "#4176ea" },
            { name: "sColorPageBtnFontHover", var_name: "color_page_btn_font_hover", type: "string", def: "#FFFFFF" },
            { name: "sColorPageBtnFontSelected", var_name: "color_page_btn_font_selected", type: "string", def: "#FFFFFF" },
            { name: "sPageBtnAlign", var_name: "page_btn_align", type: "string", def: "center" },
            { name: "sColorPageBtnBGDisabled", var_name: "color_page_btn_disabled", type: "string", def: "#e2e2e3" },
            { name: "sColorPageBtnBorderDisabled", var_name: "color_page_btn_border_disabled", type: "string", def: "#a2a2a3" },
            { name: "sColorPageBtnFontDisabled", var_name: "color_page_btn_font_disabled", type: "string", def: "#a2a2a3" }
        ];
    var aMoreParams =
        [
            { name: "sMoreFontFamily", var_name: "more_font_family", type: "string", def: "Roboto" },
            { name: "sMoreFontFamilyCustom", var_name: "more_font_family_custom", type: "string", def: "" },
            { name: "sMoreFontSize", var_name: "more_font_size", type: "string", def: "medium" },
            { name: "sMoreFontWeight", var_name: "more_font_weight", type: "string", def: "normal" },
            { name: "sMoreFontStyle", var_name: "more_font_style", type: "string", def: "normal" },
            { name: "sMoreFontColor", var_name: "color_more_btn_text", type: "string", def: "#fff" },
            { name: "sMoreFontColorHover", var_name: "color_more_btn_text_hover", type: "string", def: "#fff" },
            { name: "bMoreAsButton", var_name: "more_as_button", type: "bool", def: true },
            { name: "bMoreBtnHasBG", var_name: "more_btn_has_bg", type: "bool", def: true },
            { name: "sColorMoreBtnBG", var_name: "color_more_btn", type: "string", def: "#4176ea" },
            { name: "sColorMoreBtnBGHover", var_name: "color_more_btn_hover", type: "string", def: "#355bbb" },
            { name: "bMoreBtnHasBorder", var_name: "more_btn_has_border", type: "bool", def: false },
            { name: "sColorMoreBtnBorder", var_name: "color_more_btn_border", type: "string", def: "#4176ea" },
            { name: "sColorMoreBtnBorderHover", var_name: "color_more_btn_border_hover", type: "string", def: "#355bbb" },
            { name: "bMoreBtnHasShadow", var_name: "more_btn_has_shadow", type: "bool", def: false },
            { name: "iMoreBtnBorderWidth", var_name: "more_btn_border_width", type: "int", def: 2 },
            { name: "bMoreBtnIsRounded", var_name: "more_btn_is_rounded", type: "bool", def: false },
            { name: "sMorePosition", var_name: "more_position", type: "string", def: "left" }
        ];
    g_oALL[sHexOWTId].oDesignData = { oParams: tools_lp.get_owt_params(curParams, aDesignParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren:
                [
                    { name: "oItem", array: aItemParams },
                    { name: "oBody", array: aBodyParams },
                    { name: "oImg", array: aImgParams },
                    { name: "oPreheader", array: aPreheaderParams },
                    { name: "oHeader", array: aHeaderParams },
                    { name: "oSubheader1", array: aSubheader1Params },
                    { name: "oSubheader2", array: aSubheader2Params },
                    { name: "oText", array: aTextParams },
                    { name: "oBtn1", array: aBtn1Params },
                    { name: "oBtn2", array: aBtn2Params },
                    { name: "oFloater", array: aFloaterParams },
                    { name: "oPageBtn", array: aPageBtnParams },
                    { name: "oMore", array: aMoreParams }
                ], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } ) };
    if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.iImgSize>80 && g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout!="v")
    {
        g_oALL[sHexOWTId].oDesignData.oParams.oImg.iImgSize = 80;
    }
    return g_oALL[sHexOWTId].oDesignData;
}
function _CUSTOM_BuildFldsToSub(oArgs)
{
    g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.oParams);
    g_oALL[sHexOWTId].aFldsToSub.push(g_oALL[sHexOWTId].oRuntimeData.aItems);
    return g_oALL[sHexOWTId].aFldsToSub;
}
function _CUSTOM_BuildHTML(oArgs)
{
    var sHTMLData = "";

    var aLegacyDesignUpdates =
        [
            { name: "bAllowMinHeight", value: false },
            { name: "nItemMinHeight", value: 16 }
        ];
    if(aLegacyDesignUpdates.length>0)
    {
        g_oALL[sHexOWTId].oDesignData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oDesignData.oParams, aLegacyDesignUpdates);
    }

    var aWorkareaClasses = [ "wt-lp-witemlist-workarea", "wt-lp-witemlist-type-" + g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType ];
    AppendWorkareaClasses({ aTarget: aWorkareaClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams });
    var aWorkareaCSS = tools_lp.get_workarea_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });

    var aMsgEmptyCSS = _GetMsgEmptyCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true });

    var aOuterWrapperClasses = ["wt-lp-witemlist-outer-wrapper"];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG && g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasShadow)
    {
        aOuterWrapperClasses.push("wt-lp-has-shadow");
    }

    var aWrapperClasses = [ "wt-lp-witemlist-wrapper" ];
    AppendBlockClasses({ aTarget: aWrapperClasses, oParams: g_oALL[sHexOWTId].oDesignData.oParams, bOmitBorder: true, bOmitRounded: true, bOmitShadow: true });
    var aWrapperCSS = _GetBlockCSS({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, bArray: true, bOmitBorder: true });
    var sWrapperBGAttr = (g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG!="none" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockImgBG=="link") ? ' wt-sub-bg="sBlockImgLink"' : '';

    var aBlockHeaderClasses = [ "wt-lp-witemlist-block-outer wt-lp-witemlist-block-header" ];
    var aBlockHeaderCSS = [ "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nBlockHeaderPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockHeaderPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockHeaderPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockHeaderPaddingLeft + "em" ];

    var aBlockHeaderTitleClasses = [ "wt-lp-witemlist-block-header-title" ];
    var aBlockHeaderTitleCSS = [];
    var aBlockHeaderTitleTextCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sBlockHeaderFont" }) ];

    var aBlockFooterClasses = ["wt-lp-witemlist-block-outer wt-lp-witemlist-block-footer"];
    var aBlockFooterCSS = [ "padding:" + g_oALL[sHexOWTId].oDesignData.oParams.nBlockFooterPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockFooterPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockFooterPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.nBlockFooterPaddingLeft + "em" ];

    var aBlockPageBtnClasses = [ "wt-lp-witemlist-block-outer-btn" ];
    var aBlockPageBtnCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page")
    {
        aWrapperCSS.push("flex-direction:column");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBG || g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBorder) // rounded
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockIsRounded)
        {
            if((!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && !g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter) || (g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType=="none" && g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter && g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType=="none"))
            {
                aOuterWrapperClasses.push("wt-lp-is-rounded");
                aWrapperClasses.push("wt-lp-is-rounded");
            }
            else if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType=="none" && !g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter)
            {
                aOuterWrapperClasses.push("wt-lp-is-rounded");
                aWrapperClasses.push("wt-lp-is-rounded");
            }
            else if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter && g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType=="none")
            {
                aOuterWrapperClasses.push("wt-lp-is-rounded");
                aWrapperClasses.push("wt-lp-is-rounded");
            }
            else if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType!="none" && !g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter)
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHeaderIsRounded || g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType=="copy")
                {
                    aOuterWrapperClasses.push("wt-lp-is-rounded");
                    aBlockHeaderClasses.push("wt-lp-is-rounded-top");
                }
                else
                {
                    aOuterWrapperClasses.push("wt-lp-is-rounded-bottom");
                }
                aWrapperClasses.push("wt-lp-is-rounded-bottom");
            }
            else if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter && g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType!="none")
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockFooterIsRounded || g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType=="copy")
                {
                    aBlockFooterClasses.push("wt-lp-is-rounded-bottom");
                    aOuterWrapperClasses.push("wt-lp-is-rounded");
                }
                else
                {
                    aOuterWrapperClasses.push("wt-lp-is-rounded-top");
                }
                aWrapperClasses.push("wt-lp-is-rounded-top");
            }
            else if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType!="none" && g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter && g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType!="none")
            {
                aOuterWrapperClasses.push("wt-lp-is-rounded");
                if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHeaderIsRounded || g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType=="copy")
                {
                    aBlockHeaderClasses.push("wt-lp-is-rounded-top");
                }
                if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockFooterIsRounded || g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType=="copy")
                {
                    aBlockFooterClasses.push("wt-lp-is-rounded-bottom");
                }
            }
        }
        else
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType!="none" && g_oALL[sHexOWTId].oDesignData.oParams.bBlockHeaderIsRounded)
            {
                aBlockHeaderClasses.push("wt-lp-is-rounded");
                aOuterWrapperClasses.push("wt-lp-is-rounded-top");
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter && g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType!="none" && g_oALL[sHexOWTId].oDesignData.oParams.bBlockFooterIsRounded)
            {
                aBlockFooterClasses.push("wt-lp-is-rounded");
                aOuterWrapperClasses.push("wt-lp-is-rounded-bottom");
            }
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBorder)
    {
        if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && !g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter)
        {
            aWrapperClasses.push("wt-lp-has-border");
            aWrapperCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
        }
        else if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && !g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter)
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType=="copy")
            {
                aWrapperCSS.push("border-style: none solid solid solid; border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
            }
            else
            {
                aWrapperClasses.push("wt-lp-has-border");
                aWrapperCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
            }
        }
        else if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter)
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType=="copy")
            {
                aWrapperCSS.push("border-style: solid solid none solid; border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px 0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
            }
            else
            {
                aWrapperClasses.push("wt-lp-has-border");
                aWrapperCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
            }
        }
        else if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter)
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType=="copy" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType!="copy")
            {
                aWrapperCSS.push("border-style: none solid solid solid; border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
            }
            else if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType!="copy" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType=="copy")
            {
                aWrapperCSS.push("border-style: solid solid none solid; border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px 0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
            }
            else if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType=="copy" && g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType=="copy")
            {
                aWrapperCSS.push("border-style: none solid none solid; border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px 0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
            }
            else
            {
                aWrapperClasses.push("wt-lp-has-border");
                aWrapperCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder + ";border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
            }
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader)
    {
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGType)
        {
            case "copy":
            {
                aBlockHeaderCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBG);
                break;
            }
            case "custom":
            {
                aBlockHeaderCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBGColor);
                break;
            }
        }
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBorderType)
        {
            case "copy":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBorder)
                {
                    aBlockHeaderCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder);
                    aBlockHeaderCSS.push("border-style: solid solid none solid; border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px 0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
                }
                break;
            }
            case "custom":
            {
                aBlockHeaderCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBorderColor);
                if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHeaderBorderBottomOnly)
                {
                    if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderBorderColor=="transparent")
                    {
                        aBlockHeaderCSS.push("border-style: none; border-width: 0;margin-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockHeaderBorderWidth + "px");
                    }
                    else
                    {
                        aBlockHeaderCSS.push("border-style: none none solid none; border-width: 0 0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockHeaderBorderWidth + "px 0");
                    }
                }
                else
                {
                    aBlockHeaderCSS.push("border-style: solid; border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockHeaderBorderWidth + "px");
                }
                break;
            }
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter)
    {
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGType)
        {
            case "copy":
            {
                aBlockFooterCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBG);
                break;
            }
            case "custom":
            {
                aBlockFooterCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBGColor);
                break;
            }
        }
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBorderType)
        {
            case "copy":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockHasBorder)
                {
                    aBlockFooterCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorBlockBorder);
                    aBlockFooterCSS.push("border-style: none solid solid solid; border-width:0 " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockBorderWidth + "px");
                }
                break;
            }
            case "custom":
            {
                aBlockFooterCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBorderColor);
                if(g_oALL[sHexOWTId].oDesignData.oParams.bBlockFooterBorderTopOnly)
                {
                    if(g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterBorderColor=="transparent")
                    {
                        aBlockFooterCSS.push("border-style: none; border-width: 0; margin-top:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockFooterBorderWidth + "px");
                    }
                    else
                    {
                        aBlockFooterCSS.push("border-style: solid none none none; border-width: " + g_oALL[sHexOWTId].oDesignData.oParams.iBlockFooterBorderWidth + "px 0 0 0");
                    }
                }
                else
                {
                    aBlockFooterCSS.push("border-style: solid;border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.iBlockFooterBorderWidth + "px");
                }
                break;
            }
        }
    }

    var aHeaderLinkClasses = [ "wt-lp-witemlist-outer-link wt-lp-witemlist-outer-link-header" ];
    var aHeaderLinkCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sLinkHeaderFont", bOmitColor: true }) ];
    var aFooterLinkClasses = [ "wt-lp-witemlist-outer-link wt-lp-witemlist-outer-link-footer" ];
    var aFooterLinkCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams, sPrefix: "sLinkFooterFont", bOmitColor: true }) ];

    var aListClasses = [ "wt-lp-witemlist-list" ];
    var aListCSS = [ ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.iItemsInRow>1)
    {
        aListCSS.push("justify-content:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.sItemAlign]);
    }
    var aItemClasses = [ "wt-lp-witemlist-item", "wt-lp-witemlist-item-layout-" + g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout, "wt-lp-witemlist-item-img-" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition, (g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst ? "wt-lp-witemlist-item-header-first": "wt-lp-witemlist-item-img-first") ];
    var aItemCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.bAllowMinHeight)
    {
        aItemCSS.push("min-height:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemMinHeight + "em");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.iItemsInRow>1)
    {
        var nItemW = 100/g_oALL[sHexOWTId].oDesignData.oParams.iItemsInRow - 1;
        aItemCSS.push("width:" + nItemW + "%");
        aItemCSS.push("min-width:" + nItemW + "%");
        aItemCSS.push("max-width:" + nItemW + "%");
        aItemCSS.push("margin-right:1%");
    }
    else
    {
        aItemCSS.push("width:100%;min-width:100%;max-width:100%;margin-right:0;flex-basis:100%");
    }
    aItemCSS.push("margin-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.nItemMarginBottom + "em");
    if(!g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayImg || (g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayImg && !g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgHasNoMargins) || (g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayImg && g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst && g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout!="v"))
    {
        aItemCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBody.bItemHasBG)
    {
        aItemCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBody.sColorItemBG);
        if(g_oALL[sHexOWTId].oDesignData.oParams.oBody.bItemHasShadow)
        {
            aItemClasses.push("wt-lp-witemlist-item-has-shadow");
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBody.bItemHasBorder)
    {
        aItemClasses.push("wt-lp-witemlist-item-has-border");
        aItemCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.oBody.iItemBorderWidth + "px");
        aItemCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBody.sColorItemBorder);
    }
    if((g_oALL[sHexOWTId].oDesignData.oParams.oBody.bItemHasBG || g_oALL[sHexOWTId].oDesignData.oParams.oBody.bItemHasBorder) && g_oALL[sHexOWTId].oDesignData.oParams.oBody.bItemIsRounded)
    {
        aItemClasses.push("wt-lp-witemlist-item-is-rounded");
    }

    var aItemHeaderWrapperClasses = [ "wt-lp-witemlist-item-header-wrapper", "wt-lp-witemlist-item-header-wrapper-" + (g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst ? "header-first": "img-first") ];
    var aItemHeaderWrapperCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="v" && g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst)
    {
        aItemHeaderWrapperCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em" );
    }
    var aItemWrapperClasses = [ "wt-lp-witemlist-item-wrapper" ];
    var aItemWrapperCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayImg && g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgHasNoMargins && !g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst)
    {
        aItemWrapperCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em");
    }
    var aItemImgWrapperClasses = [ "wt-lp-witemlist-item-img-wrapper", "wt-lp-witemlist-item-img-wrapper-" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition ];
    var aItemImgWrapperCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayImg && (!g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgHasNoMargins || (g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgHasNoMargins && g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst)))
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="v")
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst)
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.iImgSize<100)
                {
                    if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgAlign=="center")
                    {
                        aItemImgWrapperCSS.push("margin:0 auto " + g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgMargin + "em auto");
                    }
                    else if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgAlign=="right")
                    {
                        aItemImgWrapperCSS.push("margin:0 0 " + g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgMargin + "em auto");
                    }
                    else
                    {
                        aItemImgWrapperCSS.push("margin:0 auto " + g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgMargin + "em 0");
                    }
                }
                else
                {
                    aItemImgWrapperCSS.push("margin:0");
                }
            }
            else
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgAlign=="center")
                {
                    aItemImgWrapperCSS.push("margin:0 auto " + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em auto");
                }
                else if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgAlign=="right")
                {
                    aItemImgWrapperCSS.push("margin:0 0 " + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em auto");
                }
                else
                {
                    aItemImgWrapperCSS.push("margin:0 auto " + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em 0");
                }
            }
        }
        else
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition=="left")
            {
                aItemImgWrapperCSS.push("margin:0 " + (g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgMargin + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding) + "em 0 0");
            }
            else
            {
                aItemImgWrapperCSS.push("margin:0 0 0 " + (g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgMargin + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding) + "em");
            }
        }
    }
    else if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayImg && g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgHasNoMargins)
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="v")
        {
            aItemImgWrapperCSS.push("margin:0 0 " + (g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgMargin + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding) + "em 0");
        }
        else if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition=="right")
        {
            aItemImgWrapperCSS.push("margin:0 0 0 " + (g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgMargin + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding) + "em");
        }
        else if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition=="left")
        {
            aItemImgWrapperCSS.push("margin:0 " + (g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgMargin + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding) + "em 0 0");
        }
    }
    else
    {
        aItemImgWrapperCSS.push("display:none");
    }
    var aItemInfoWrapperClasses = [ "wt-lp-witemlist-item-info-wrapper" ];
    var aItemInfoWrapperCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout!="v")
    {
        aItemImgWrapperCSS.push("width:" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.iImgSize + "%");
        aItemImgWrapperCSS.push("min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.iImgSize + "%");
        aItemWrapperCSS.push("flex-grow:1");
    }
    else
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.bRoundImg)
        {
            aItemImgWrapperCSS.push("width:" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.iImgSize + "%");
            aItemImgWrapperCSS.push("min-width:" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.iImgSize + "%");
            aItemWrapperCSS.push("flex-grow:1");
        }
        else
        {
            aItemImgWrapperCSS.push("width:100%");
            aItemInfoWrapperCSS.push("width:100%");
            aItemInfoWrapperCSS.push("flex-grow:1");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst)
        {
            aItemInfoWrapperCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em");
        }
    }

    var aPreHeaderClasses = [ "wt-lp-witemlist-preheader" ];
    var aPreHeaderCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams.oPreheader, sPrefix: "sPreHeaderFont", sSizePrefix: "subheader" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.oPreheader.sPreHeaderAlign ];

    var aHeaderClasses = [ "wt-lp-witemlist-header" ];
    var aHeaderCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams.oHeader, sPrefix: "sHeaderFont", sSizePrefix: "header" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.oHeader.sHeaderAlign ];

    var aSubHeader1Classes = [ "wt-lp-witemlist-subheader", "wt-lp-witemlist-subheader1" ];
    var aSubHeader1CSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams.oSubheader1, sPrefix: "sSubHeader1Font", sSizePrefix: "subheader" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.oSubheader1.sSubHeader1Align ];

    var aSubHeader2Classes = [ "wt-lp-witemlist-subheader", "wt-lp-witemlist-subheader2" ];
    var aSubHeader2CSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams.oSubheader2, sPrefix: "sSubHeader2Font", sSizePrefix: "subheader" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.oSubheader2.sSubHeader2Align ];

    var aRtfTextClasses = [ "wt-lp-witemlist-rtftext" ];
    var aRtfTextCSS = [ tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams.oText, sPrefix: "sTextFont" }), "text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.oText.sTextAlign ];

    var aSizes = [ "x-small", "small", "medium", "large", "x-large", "xx-large" ];
    var sMaxBtnSize = (aSizes.indexOf(g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sBtn1FontSize) >= aSizes.indexOf(g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sBtn2FontSize)) ? g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sBtn1FontSize : g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sBtn2FontSize;
    var nMaxSize = 3.2*OptReal(oLPParams.fontsize[sMaxBtnSize].split("em")[0]);

    var aControlsClasses = [ "wt-lp-witemlist-controls" ];
    var aControlsCSS = [ "align-items:" + oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.oItem.sBtnAlign], "justify-content:" +  oLPParams.flexalign[g_oALL[sHexOWTId].oDesignData.oParams.oItem.sBtnValign] ];
    var aBtnContainerClasses = [ "wt-lp-witemlist-btn-container", "wt-lp-witemlist-btn-container-" + g_oALL[sHexOWTId].oDesignData.oParams.oItem.sBtnAlign ];
    var aBtnContainerCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="h_btns_inline")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst)
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition=="left")
            {
                aControlsCSS.push("padding:0 0 0 " + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em");
            }
            else if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition=="right")
            {
                aControlsCSS.push("padding:0 " + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em 0 0");
            }
        }
        else
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition=="left")
            {
                aControlsCSS.push("padding:0 0 0 " + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em");
            }
            else if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition=="right")
            {
                aControlsCSS.push("padding:0 " + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em 0 0");
            }
        }
    }
    else if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="h_btns_below" || g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="v")
    {
        aControlsCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.oItem.nItemPadding + "em 0 0 0");
    }

    var aBtn1OuterClasses = [ "wt-lp-witemlist-btn-outer", "wt-lp-witemlist-btn1-outer" ];
    var aBtn1OuterCSS = [ "height:" + nMaxSize + "em" ];
    var aBtn1Classes = [ "wt-lp-witemlist-btn1" ];
    var aBtn1CSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams.oBtn1, sPrefix: "sBtn1Font", bArray: true });
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.bBtn1HasBorder)
    {
        aBtn1OuterClasses.push("wt-lp-witemlist-btn-border");
        aBtn1OuterCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.iBtn1BorderWidth + "px");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.bBtn1IsRounded && (g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.bBtn1HasBG || g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.bBtn1HasBorder))
    {
        aBtn1OuterClasses.push("wt-lp-witemlist-btn-rounded");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.bBtn1HasShadow && g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.bBtn1HasBG)
    {
        aBtn1OuterClasses.push("wt-lp-witemlist-btn-shadow");
    }
    var aBtn2OuterClasses = [ "wt-lp-witemlist-btn-outer", "wt-lp-witemlist-btn2-outer" ];
    var aBtn2OuterCSS = [ "height:" + nMaxSize + "em"];
    var aBtn2Classes = [ "wt-lp-witemlist-btn2" ];
    var aBtn2CSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams.oBtn2, sPrefix: "sBtn2Font", bArray: true });
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.bBtn2HasBorder)
    {
        aBtn2OuterClasses.push("wt-lp-witemlist-btn-border");
        aBtn2OuterCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.iBtn2BorderWidth + "px");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.bBtn2IsRounded && (g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.bBtn2HasBG || g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.bBtn2HasBorder))
    {
        aBtn2OuterClasses.push("wt-lp-witemlist-btn-rounded");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.bBtn2HasShadow && g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.bBtn2HasBG)
    {
        aBtn2OuterClasses.push("wt-lp-witemlist-btn-shadow");
    }
    var aFloaterClasses = [];
    var aFloaterCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayFloater)
    {
        aFloaterClasses = [ "wt-lp-witemlist-floater" ];
        aFloaterCSS = tools_lp.get_font_css({ oParams: g_oALL[sHexOWTId].oDesignData.oParams.oFloater, sPrefix: "sFloaterFont", sSizePrefix: "note", bArray: true });
        aFloaterCSS.push("width:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.iFloaterWidth + "%");
        aFloaterCSS.push("text-align:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.sFloaterTextAlign);
        aFloaterCSS.push("padding:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.nFloaterPaddingTop + "em " + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.nFloaterPaddingRight + "em " + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.nFloaterPaddingBottom + "em " + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.nFloaterPaddingLeft + "em");
        switch(g_oALL[sHexOWTId].oDesignData.oParams.oFloater.sFloaterPosition)
        {
            case "top-left":
            case "bottom-left":
            {
                aFloaterCSS.push("left:0;margin-left:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.nFloaterMarginH + "em");
                break;
            }
            case "top-right":
            case "bottom-right":
            {
                aFloaterCSS.push("right:0;margin-right:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.nFloaterMarginH + "em");
                break;
            }
        }
        switch(g_oALL[sHexOWTId].oDesignData.oParams.oFloater.sFloaterPosition)
        {
            case "top-left":
            case "top-right":
            {
                aFloaterCSS.push("top:0;margin-top:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.nFloaterMarginV + "em");
                break;
            }
            case "bottom-left":
            case "bottom-right":
            {
                aFloaterCSS.push("bottom:0;margin-bottom:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.nFloaterMarginV + "em");
                break;
            }
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterHasBG)
        {
            aFloaterCSS.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.sColorFloaterBG);
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterHasBorder)
        {
            aFloaterClasses.push("wt-lp-witemlist-btn-border");
            aFloaterCSS.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.sColorFloaterBorder);
            aFloaterCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.oFloater.iFloaterBorderWidth + "px");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterIsRounded && (g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterHasBG || g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterHasBorder))
        {
            aFloaterClasses.push("wt-lp-witemlist-btn-rounded");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterHasShadow && g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterHasBG)
        {
            aFloaterClasses.push("wt-lp-witemlist-btn-shadow");
        }
    }

    var aImgClasses = [ "wt-lp-witemlist-image" ];
    var aImgCSS = ( g_oALL[sHexOWTId].oDesignData.oParams.oImg.bRoundImg ) ? [ "height:100%", "background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.sColorImgBG ] : [ "padding-top:" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.nImgHeight + "%", "background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.sColorImgBG ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgIsRounded)
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgHasNoMargins && g_oALL[sHexOWTId].oDesignData.oParams.oBody.bItemIsRounded)
        {
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="v")
            {
                if(!g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst)
                {
                    aImgClasses.push("wt-lp-witemlist-image-is-rounded-top");
                }
            }
            else
            {
                aImgClasses.push("wt-lp-witemlist-image-is-rounded-" + g_oALL[sHexOWTId].oDesignData.oParams.oImg.sImgPosition);
            }
        }
        else
        {
            aImgClasses.push("wt-lp-witemlist-image-is-rounded");
        }
    }
    if ( g_oALL[sHexOWTId].oDesignData.oParams.oImg.bRoundImg )
    {
        aImgClasses.push("wt-lp-wcolumns-img-round");
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgHasShadow && !g_oALL[sHexOWTId].oDesignData.oParams.oImg.bImgHasNoMargins)
    {
        aImgClasses.push("wt-lp-witemlist-image-has-shadow");
    }
    var aMoreBtnContainerClasses = [ "wt-lp-witemlist-more-container", "wt-lp-witemlist-more-" + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMorePosition ];
    var aMoreBtnClasses = [];
    var aMoreBtnCSS = [];
    var aMoreLinkClasses = [];
    var aMoreLinkCSS = [];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreAsButton)
    {
        aMoreBtnClasses = [ "wt-lp-witemlist-btn-more" ];
        aMoreBtnCSS = [ "font-family:" + (g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontFamily=="Custom" ? g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontFamilyCustom : oLPParams.fontfamily[g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontFamily]), "font-weight:" + oLPParams.fontweight[g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontWeight], "font-style:" + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontStyle, "font-size:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontSize] ];
        if(g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreBtnHasBG && g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreBtnHasShadow)
        {
            aMoreBtnClasses.push("wt-lp-witemlist-btn-shadow");
        }
        if((g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreBtnHasBG || g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreBtnHasBorder) && g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreBtnIsRounded)
        {
            aMoreBtnClasses.push("wt-lp-witemlist-btn-rounded");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreBtnHasBorder)
        {
            aMoreBtnCSS.push("border-width:" + g_oALL[sHexOWTId].oDesignData.oParams.oMore.iMoreBtnBorderWidth + "px");
        }
    }
    else
    {
        aMoreLinkClasses = [ "wt-lp-witemlist-link-more" ];
        aMoreLinkCSS = [ "font-family:" + (g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontFamily=="Custom" ? g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontFamilyCustom : oLPParams.fontfamily[g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontFamily]), "font-weight:" + oLPParams.fontweight[g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontWeight], "font-style:" + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontStyle, "font-size:" + oLPParams.fontsize[g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontSize] ];
    }

    /*define css rules to append in head*/
    var aCSSBtn1Idle = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sBtn1FontColor ];
    var aCSSBtn2Idle = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sBtn2FontColor ];
    var aCSSBtn1Hover = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sBtn1FontColorHover + " !important" ];
    var aCSSBtn2Hover = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sBtn2FontColorHover + " !important" ];
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.bBtn1HasBG)
    {
        aCSSBtn1Idle.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sColorBtn1BG);
        aCSSBtn1Hover.push("background-color: " + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sColorBtn1BGHover);
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.bBtn2HasBG)
    {
        aCSSBtn2Idle.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sColorBtn2BG);
        aCSSBtn2Hover.push("background-color: " + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sColorBtn2BGHover);
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.bBtn1HasBorder)
    {
        aCSSBtn1Idle.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sColorBtn1Border);
        aCSSBtn1Hover.push("border-color: " + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sColorBtn1BorderHover);
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.bBtn2HasBorder)
    {
        aCSSBtn2Idle.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sColorBtn2Border);
        aCSSBtn2Hover.push("border-color: " + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sColorBtn2BorderHover);
    }

    var sDivCSSName = "#WT_" + sHexOWTId;
    var sCSSToAppend = sDivCSSName + " { " + aWorkareaCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-wrapper {" + aWrapperCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-msg-empty {" + aMsgEmptyCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-block-header {" + aBlockHeaderCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-header-title-text {" + aBlockHeaderTitleTextCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-block-footer {" + aBlockFooterCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-outer-link-header {" + aHeaderLinkCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-outer-link-footer {" + aFooterLinkCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-list {" + aListCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-item {" + aItemCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-item-header-wrapper {" + aItemHeaderWrapperCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-item-wrapper {" + aItemWrapperCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-item-img-wrapper {" + aItemImgWrapperCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-item-info-wrapper {" + aItemInfoWrapperCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-preheader {" + aPreHeaderCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-header {" + aHeaderCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-subheader1 {" + aSubHeader1CSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-subheader2 {" + aSubHeader2CSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-rtftext {" + aRtfTextCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-controls {" + aControlsCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn1-outer {" + aBtn1OuterCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn1 {" + aBtn1CSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn2-outer {" + aBtn2OuterCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn2 {" + aBtn2CSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-image {" + aImgCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn-more {" + aMoreBtnCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-link-more {" + aMoreLinkCSS.join(";") + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn1-outer {" + aCSSBtn1Idle.join(';') + "; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn1-outer:hover {" + aCSSBtn1Hover.join(';') + "}\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn1-outer:hover .wt-lp-witemlist-btn1 {" + aCSSBtn1Hover.join(';') + "}\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn2-outer {" + aCSSBtn2Idle.join(';') + "}\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn2-outer:hover {" + aCSSBtn2Hover.join(';') + "}\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn2-outer:hover  .wt-lp-witemlist-btn2 {" + aCSSBtn2Hover.join(';') + "}\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-item:nth-of-type(" + g_oALL[sHexOWTId].oDesignData.oParams.iItemsInRow + ") { margin-right: 0; }\n";
    sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-floater {" + aFloaterCSS.join(';') + ";}\n";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="row")
    {
        var aCSSMoreBtnIdle = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontColor ];
        var aCSSMoreBtnHover = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sMoreFontColorHover ];
        if(g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreBtnHasBG)
        {
            aCSSMoreBtnIdle.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sColorMoreBtnBG);
            aCSSMoreBtnHover.push("background-color: " + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sColorMoreBtnBGHover);
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreBtnHasBorder)
        {
            aCSSMoreBtnIdle.push("border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sColorMoreBtnBorder);
            aCSSMoreBtnHover.push("border-color: " + g_oALL[sHexOWTId].oDesignData.oParams.oMore.sColorMoreBtnBorderHover);
        }
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn-more {" + aCSSMoreBtnIdle.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-btn-more:hover {" + aCSSMoreBtnHover.join(';') + "}\n";
    }
    else if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page")
    {
        var aCSSPageBtnIdle = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnFont ];
        var aCSSPageBtnHover = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnFontHover ];
        var aCSSPageBtnSelected = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnFontSelected ];
        var aCSSPageBtnDisabled = [ "color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnFontDisabled ];
        var aCSSBtnSVGIdle = [ "fill:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnFont ];
        var aCSSBtnSVGHover = [ "fill:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnFontHover ];
        var aCSSBtnSVGDisabled = [ "fill:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnFontDisabled ];
        if(g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.bPageBtnHasBG)
        {
            aCSSPageBtnIdle.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnBG);
            aCSSPageBtnHover.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnBGHover);
            aCSSPageBtnSelected.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnBGSelected);
            aCSSPageBtnDisabled.push("background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnBGDisabled);
        }
        else
        {
            aCSSPageBtnIdle.push("background-color:transparent");
            aCSSPageBtnHover.push("background-color:transparent");
            aCSSPageBtnSelected.push("background-color:transparent");
            aCSSPageBtnDisabled.push("background-color:transparent");
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.bPageBtnHasBorder)
        {
            aCSSPageBtnIdle.push("border-width:1px;border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnBorder);
            aCSSPageBtnHover.push("border-width:1px;border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnBorderHover);
            aCSSPageBtnSelected.push("border-width:1px;border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnBorderSelected);
            aCSSPageBtnDisabled.push("border-width:1px;border-color:" + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sColorPageBtnBorderDisabled);
        }
        else
        {
            aCSSPageBtnIdle.push("border:none");
            aCSSPageBtnHover.push("border:none");
            aCSSPageBtnSelected.push("border:none");
            aCSSPageBtnDisabled.push("border:none");
        }
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-pagelist-btn {" + aCSSPageBtnIdle.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-pagelist-btn:not([disabled]):hover {" + aCSSPageBtnHover.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-pagelist-btn[disabled] {" + aCSSPageBtnSelected.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-block-outer-btn {" + aCSSPageBtnIdle.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-block-outer-btn:not([disabled]):hover {" + aCSSPageBtnHover.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-block-outer-btn[disabled] {" + aCSSPageBtnDisabled.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-block-outer-btn path {" + aCSSBtnSVGIdle.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-block-outer-btn:not([disabled]):hover path {" + aCSSBtnSVGHover.join(';') + "}\n";
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-block-outer-btn[disabled] path {" + aCSSBtnSVGDisabled.join(';') + "}\n";
    }
    var sTotalHTML = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayHeaderTotal)
    {
        sTotalHTML += '<div class="wt-lp-witemlist-header-total" wt-role="header-total"></div>';
        sCSSToAppend += sDivCSSName + " .wt-lp-witemlist-header-total { background-color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorHeaderTotalBG + ";color:" + g_oALL[sHexOWTId].oDesignData.oParams.sColorHeaderTotalFont + ";}\n";
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle!="")
    {
        sCSSToAppend += _UpdateCustomStyles({ sText: g_oALL[sHexOWTId].oDesignData.oParams.sCustomCSSStyle, sPrefix: sDivCSSName + " " });
    }

    /*creating html*/
    sHTMLData = "";
    if(g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop!="")
    {
        sHTMLData += '<a id="' + g_oALL[sHexOWTId].oDesignData.oParams.sAnchorTop + '"></a>';
    }
    sHTMLData += '<div class="' + aWorkareaClasses.join(' ') + '" wt-lazy-block="1" wt-id="' + sHexOWTId + '" wt-owt-id="' + sHexOWTId + '" id="WT_' + sHexOWTId + '"';
    if(bLPE)
    {
        sHTMLData += ' wt-used-context="' + aUsedContext.join(";") + '"';
    }
    sHTMLData += '>';
    sHTMLData += '<div class="wt-template-storage" wt-template-box="' + sHexOWTId + '" id="WT_ST_' + sHexOWTId + '">';
    sHTMLData += '<ul>';
    sHTMLData += '<li class="' + aItemClasses.join(' ') + '" wt-lazy-item="1" wt-role="item" wt-owt-id="' + sHexOWTId + '">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bLayoutHeaderFirst)
    {
        sHTMLData += '<div class="' + aItemHeaderWrapperClasses.join(' ') + '" wt-role="header-wrapper">';
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayPreHeader)
        {
            sHTMLData += '<div class="' + aPreHeaderClasses.join(' ') + '" wt-role="preheader"></div>';
        }
        sHTMLData += '<div class="' + aHeaderClasses.join(' ') + '" wt-role="header"></div>';
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplaySubHeader1)
        {
            sHTMLData += '<div class="' + aSubHeader1Classes.join(' ') + '" wt-role="subheader1"></div>';
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplaySubHeader2)
        {
            sHTMLData += '<div class="' + aSubHeader2Classes.join(' ') + '" wt-role="subheader2"></div>';
        }
        sHTMLData += '</div>';
        sHTMLData += '<div class="' + aItemWrapperClasses.join(' ') + '" wt-role="item-wrapper">';
        sHTMLData += '<div class="' + aItemImgWrapperClasses.join(' ') + '" wt-role="img-wrapper">';
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayImg)
        {
            sHTMLData += '<div class="' + aImgClasses.join(' ') + '" wt-role="img">';
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayFloater && g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterOnImg)
            {
                sHTMLData += '<div class="' + aFloaterClasses.join(' ') + '" wt-role="floater"></div>';
            }
            sHTMLData += '</div>';
        }
        sHTMLData += '</div>';
        sHTMLData += '<div class="' + aItemInfoWrapperClasses.join(' ') + '" wt-role="info-wrapper">';
        sHTMLData += '<div class="' + aRtfTextClasses.join(' ') + '" wt-role="text"></div>';
        if((g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="h_btns_below" || g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="v") && (g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn1 || g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn2))
        {
            sHTMLData += '<div class="' + aControlsClasses.join(' ') + '" wt-role="controls">';
            sHTMLData += '<div class="' + aBtnContainerClasses.join(' ') + '" wt-role="btns-wrapper">';
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn1)
            {
                sHTMLData += '<a wt-role="item-btn" wt-btn="1" class="wt-lp-witemlist-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sTarget + '">';
                sHTMLData += '<div class="' + aBtn1OuterClasses.join(' ') + '"><div class="' + aBtn1Classes.join(' ') + '" wt-role="btn-text"></div></div>';
                sHTMLData += '</a>';
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn2)
            {
                sHTMLData += '<a wt-role="item-btn" wt-btn="2" class="wt-lp-witemlist-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sTarget + '">';
                sHTMLData += '<div class="' + aBtn2OuterClasses.join(' ') + '"><div class="' + aBtn2Classes.join(' ') + '" wt-role="btn-text"></div></div>';
                sHTMLData += '</a>';
            }
            sHTMLData += '</div>';
            sHTMLData += '</div>';
        }
        sHTMLData += '</div>';
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="h_btns_inline" && (g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn1 || g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn2))
        {
            sHTMLData += '<div class="' + aControlsClasses.join(' ') + '" wt-role="controls">';
            sHTMLData += '<div class="' + aBtnContainerClasses.join(' ') + '" wt-role="btns-wrapper">';
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn1)
            {
                sHTMLData += '<a wt-role="item-btn" wt-btn="1" class="wt-lp-witemlist-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sTarget + '">';
                sHTMLData += '<div class="' + aBtn1OuterClasses.join(' ') + '"><div class="' + aBtn1Classes.join(' ') + '" wt-role="btn-text"></div></div>';
                sHTMLData += '</a>';
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn2)
            {
                sHTMLData += '<a wt-role="item-btn" wt-btn="2" class="wt-lp-witemlist-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sTarget + '">';
                sHTMLData += '<div class="' + aBtn2OuterClasses.join(' ') + '"><div class="' + aBtn2Classes.join(' ') + '" wt-role="btn-text"></div></div>';
                sHTMLData += '</a>';
            }
            sHTMLData += '</div>';
            sHTMLData += '</div>';
        }
        sHTMLData += '</div>';
    }
    else
    {
        sHTMLData += '<div class="' + aItemImgWrapperClasses.join(' ') + '" wt-role="img-wrapper">';
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayImg)
        {
            sHTMLData += '<div class="' + aImgClasses.join(' ') + '" wt-role="img">';
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayFloater && g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterOnImg)
            {
                sHTMLData += '<div class="' + aFloaterClasses.join(' ') + '" wt-role="floater"></div>';
            }
            sHTMLData += '</div>';
        }
        sHTMLData += '</div>';
        sHTMLData += '<div class="' + aItemWrapperClasses.join(' ') + '" wt-role="item-wrapper">';
        sHTMLData += '<div class="' + aItemHeaderWrapperClasses.join(' ') + '" wt-role="header-wrapper">';
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayPreHeader)
        {
            sHTMLData += '<div class="' + aPreHeaderClasses.join(' ') + '" wt-role="preheader"></div>';
        }
        sHTMLData += '<div class="' + aHeaderClasses.join(' ') + '" wt-role="header"></div>';
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplaySubHeader1)
        {
            sHTMLData += '<div class="' + aSubHeader1Classes.join(' ') + '" wt-role="subheader1"></div>';
        }
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplaySubHeader2)
        {
            sHTMLData += '<div class="' + aSubHeader2Classes.join(' ') + '" wt-role="subheader2"></div>';
        }
        sHTMLData += '</div>';
        sHTMLData += '<div class="' + aItemInfoWrapperClasses.join(' ') + '" wt-role="info-wrapper">';
        sHTMLData += '<div class="' + aRtfTextClasses.join(' ') + '" wt-role="text"></div>';
        if((g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="h_btns_below" || g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="v") && (g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn1 || g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn2))
        {
            sHTMLData += '<div class="' + aControlsClasses.join(' ') + '" wt-role="controls">';
            sHTMLData += '<div class="' + aBtnContainerClasses.join(' ') + '" wt-role="btns-wrapper">';
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn1)
            {
                sHTMLData += '<a wt-role="item-btn" wt-btn="1" class="wt-lp-witemlist-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sTarget + '">';
                sHTMLData += '<div class="' + aBtn1OuterClasses.join(' ') + '"><div class="' + aBtn1Classes.join(' ') + '" wt-role="btn-text"></div></div>';
                sHTMLData += '</a>';
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn2)
            {
                sHTMLData += '<a wt-role="item-btn" wt-btn="2" class="wt-lp-witemlist-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sTarget + '">';
                sHTMLData += '<div class="' + aBtn2OuterClasses.join(' ') + '"><div class="' + aBtn2Classes.join(' ') + '" wt-role="btn-text"></div></div>';
                sHTMLData += '</a>';
            }
            sHTMLData += '</div>';
            sHTMLData += '</div>';
        }
        sHTMLData += '</div>';
        sHTMLData += '</div>';
        if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.sItemLayout=="h_btns_inline" && (g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn1 || g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn2))
        {
            sHTMLData += '<div class="' + aControlsClasses.join(' ') + '" wt-role="controls">';
            sHTMLData += '<div class="' + aBtnContainerClasses.join(' ') + '" wt-role="btns">';
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn1)
            {
                sHTMLData += '<a wt-role="item-btn" wt-btn="1" class="wt-lp-witemlist-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.oBtn1.sTarget + '">';
                sHTMLData += '<div class="' + aBtn1OuterClasses.join(' ') + '"><div class="' + aBtn1Classes.join(' ') + '" wt-role="btn-text"></div></div>';
                sHTMLData += '</a>';
            }
            if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayBtn2)
            {
                sHTMLData += '<a wt-role="item-btn" wt-btn="2" class="wt-lp-witemlist-link" href="" target="' + g_oALL[sHexOWTId].oDesignData.oParams.oBtn2.sTarget + '">';
                sHTMLData += '<div class="' + aBtn2OuterClasses.join(' ') + '"><div class="' + aBtn2Classes.join(' ') + '" wt-role="btn-text"></div></div>';
                sHTMLData += '</a>';
            }
            sHTMLData += '</div>';
            sHTMLData += '</div>';
        }
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.oItem.bDisplayFloater && !g_oALL[sHexOWTId].oDesignData.oParams.oFloater.bFloaterOnImg)
    {
        sHTMLData += '<div class="' + aFloaterClasses.join(' ') + '" wt-role="floater"></div>';
    }
    sHTMLData += '</li>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page")
    {
        sHTMLData += '<li class="wt-lp-witemlist-pagelist-item" wt-role="page"><button class="wt-lp-witemlist-pagelist-btn" type="button" wt-role="page-btn" wt-page-id="" wt-owt-id="' + sHexOWTId + '"></button></li>';
    }
    if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="row")
    {
        if(g_oALL[sHexOWTId].oDesignData.oParams.oMore.bMoreAsButton)
        {
            sHTMLData += '<li class="' + aMoreBtnContainerClasses.join(' ') + '" wt-lazy-item="1" wt-role="more" wt-owt-id="' + sHexOWTId + '" wt-chunk-id=""><button class="' + aMoreBtnClasses.join(' ') + '" wt-role="more-btn" type="button" wt-chunk-id="" wt-sub-html="sTextMore"></button></li>';
        }
        else
        {
            sHTMLData += '<li class="' + aMoreBtnContainerClasses.join(' ') + '" wt-lazy-item="1" wt-role="more" wt-owt-id="' + sHexOWTId + '" wt-chunk-id=""><a class="' + aMoreLinkClasses.join(' ') + '" wt-role="more-btn" href="javascript:void(0)" wt-chunk-id="" wt-sub-html="sTextMore"></a></li>';
        }
    }
    sHTMLData += '</ul>';
    sHTMLData += '</div>';
    sHTMLData += '<div class="' + aOuterWrapperClasses.join(' ') + '">';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader)
    {
        sHTMLData += '<div class="' + aBlockHeaderClasses.join(' ') + '" wt-type="' + g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderLayout + '"';
        if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page" && (g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="top" || g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="both"))
        {
            sHTMLData += ' wt-align="' + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnAlign + '"';
        }
        sHTMLData += '>';
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sBlockHeaderLayout)
        {
            case "title":
            case "title-none":
            case "none-title":
            {
                sHTMLData += '<div class="' + aBlockHeaderTitleClasses.join(' ') + '"><div class="wt-lp-witemlist-header-title-text" wt-sub-html="sBlockHeaderText"></div>' + sTotalHTML + '</div>';
                break;
            }
            case "btns-title":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.29289 18.7071C9.68342 19.0976 10.3166 19.0976 10.7071 18.7071C11.0976 18.3166 11.0976 17.6834 10.7071 17.2929L6.41421 13L21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11L6.41421 11L10.7071 6.70711C11.0976 6.31658 11.0976 5.68342 10.7071 5.29289C10.3166 4.90237 9.68342 4.90237 9.29289 5.29289L3.29437 11.2914L3.29289 11.2929M3.29144 11.2944L2.58579 12L3.29289 12.7071L9.29289 18.7071"/></svg></span></button>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-next-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.7071 5.29289C14.3166 4.90237 13.6834 4.90237 13.2929 5.29289C12.9024 5.68342 12.9024 6.31658 13.2929 6.70711L17.5858 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H17.5858L13.2929 17.2929C12.9024 17.6834 12.9024 18.3166 13.2929 18.7071C13.6834 19.0976 14.3166 19.0976 14.7071 18.7071L20.7071 12.7071L21.4142 12L20.7074 11.2932C20.7072 11.2929 20.707 11.2927 20.7067 11.2925M14.7071 5.29289L20.7067 11.2925L14.7071 5.29289Z"/></svg></span></button>';
                sHTMLData += '<div class="' + aBlockHeaderTitleClasses.join(' ') + '"><div class="wt-lp-witemlist-header-title-text" wt-sub-html="sBlockHeaderText"></div>' + sTotalHTML + '</div>';
                break;
            }
            case "btn-title-btn":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.29289 18.7071C9.68342 19.0976 10.3166 19.0976 10.7071 18.7071C11.0976 18.3166 11.0976 17.6834 10.7071 17.2929L6.41421 13L21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11L6.41421 11L10.7071 6.70711C11.0976 6.31658 11.0976 5.68342 10.7071 5.29289C10.3166 4.90237 9.68342 4.90237 9.29289 5.29289L3.29437 11.2914L3.29289 11.2929M3.29144 11.2944L2.58579 12L3.29289 12.7071L9.29289 18.7071"/></svg></span></button>';
                sHTMLData += '<div class="' + aBlockHeaderTitleClasses.join(' ') + '"><div class="wt-lp-witemlist-header-title-text" wt-sub-html="sBlockHeaderText"></div>' + sTotalHTML + '</div>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-next-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.7071 5.29289C14.3166 4.90237 13.6834 4.90237 13.2929 5.29289C12.9024 5.68342 12.9024 6.31658 13.2929 6.70711L17.5858 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H17.5858L13.2929 17.2929C12.9024 17.6834 12.9024 18.3166 13.2929 18.7071C13.6834 19.0976 14.3166 19.0976 14.7071 18.7071L20.7071 12.7071L21.4142 12L20.7074 11.2932C20.7072 11.2929 20.707 11.2927 20.7067 11.2925M14.7071 5.29289L20.7067 11.2925L14.7071 5.29289Z"/></svg></span></button>';
                break;
            }
            case "title-btns":
            {
                sHTMLData += '<div class="' + aBlockHeaderTitleClasses.join(' ') + '"><div class="wt-lp-witemlist-header-title-text" wt-sub-html="sBlockHeaderText"></div>' + sTotalHTML + '</div>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.29289 18.7071C9.68342 19.0976 10.3166 19.0976 10.7071 18.7071C11.0976 18.3166 11.0976 17.6834 10.7071 17.2929L6.41421 13L21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11L6.41421 11L10.7071 6.70711C11.0976 6.31658 11.0976 5.68342 10.7071 5.29289C10.3166 4.90237 9.68342 4.90237 9.29289 5.29289L3.29437 11.2914L3.29289 11.2929M3.29144 11.2944L2.58579 12L3.29289 12.7071L9.29289 18.7071"/></svg></span></button>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-next-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.7071 5.29289C14.3166 4.90237 13.6834 4.90237 13.2929 5.29289C12.9024 5.68342 12.9024 6.31658 13.2929 6.70711L17.5858 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H17.5858L13.2929 17.2929C12.9024 17.6834 12.9024 18.3166 13.2929 18.7071C13.6834 19.0976 14.3166 19.0976 14.7071 18.7071L20.7071 12.7071L21.4142 12L20.7074 11.2932C20.7072 11.2929 20.707 11.2927 20.7067 11.2925M14.7071 5.29289L20.7067 11.2925L14.7071 5.29289Z"/></svg></span></button>';
                break;
            }
            case "title-link":
            {
                sHTMLData += '<div class="' + aBlockHeaderTitleClasses.join(' ') + '"><div class="wt-lp-witemlist-header-title-text" wt-sub-html="sBlockHeaderText"></div>' + sTotalHTML + '</div>';
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkHeaderURL!="")
                {
                    sHTMLData += '<a class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-attr="href|sLinkHeaderURL" wt-sub-html="sLinkHeaderText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-html="sLinkHeaderText"></div>';
                }
                break;
            }
            case "link-title":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkHeaderURL!="")
                {
                    sHTMLData += '<a class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-attr="href|sLinkHeaderURL" wt-sub-html="sLinkHeaderText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-html="sLinkHeaderText"></div>';
                }
                sHTMLData += '<div class="' + aBlockHeaderTitleClasses.join(' ') + '"><div class="wt-lp-witemlist-header-title-text" wt-sub-html="sBlockHeaderText"></div>' + sTotalHTML + '</div>';
                break;
            }
            case "link":
            case "link-none":
            case "none-link":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkHeaderURL!="")
                {
                    sHTMLData += '<a class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-attr="href|sLinkHeaderURL" wt-sub-html="sLinkHeaderText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-html="sLinkHeaderText"></div>';
                }
                break;
            }
            case "link-btns":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkHeaderURL!="")
                {
                    sHTMLData += '<a class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-attr="href|sLinkHeaderURL" wt-sub-html="sLinkHeaderText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-html="sLinkHeaderText"></div>';
                }
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-next-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                break;
            }
            case "btn-link-btn":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkHeaderURL!="")
                {
                    sHTMLData += '<a class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-attr="href|sLinkHeaderURL" wt-sub-html="sLinkHeaderText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-html="sLinkHeaderText"></div>';
                }
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-next-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                break;
            }
            case "btns-link":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-next-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkHeaderURL!="")
                {
                    sHTMLData += '<a class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-attr="href|sLinkHeaderURL" wt-sub-html="sLinkHeaderText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aHeaderLinkClasses.join(' ') + '" wt-role="header-link" wt-sub-html="sLinkHeaderText"></div>';
                }
                break;
            }
            case "none-btns":
            case "btns-none":
            case "btns":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-next-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                break;
            }
            case "btn-none-btn":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                sHTMLData += '<div class="wt-lp-witemlist-none" wt-role="none"></div>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-next-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                break;
            }
            case "pager":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page" && (g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="top" || g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="both"))
                {
                    sHTMLData += '<ul class="wt-lp-witemlist-pagelist wt-lp-witemlist-pagelist-bottom" wt-role="page-list"></ul>';
                }
                break;
            }
        }
        sHTMLData += '</div>';
    }
    sHTMLData += '<div class="' + aWrapperClasses.join(' ') + '" ' + sWrapperBGAttr + '>';
    if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockHeader && g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page" && (g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="top" || g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="both"))
    {
        sHTMLData += '<ul class="wt-lp-witemlist-pagelist wt-lp-witemlist-pagelist-top" wt-role="page-list"></ul>';
    }
    sHTMLData += '<ul class="' + aListClasses.join(' ') + '" wt-role="list"></ul>';
    if(!g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter && g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page" && (g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="bottom" || g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="both"))
    {
        sHTMLData += '<ul class="wt-lp-witemlist-pagelist wt-lp-witemlist-pagelist-bottom" wt-role="page-list"></ul>';
    }
    sHTMLData += '<div class="wt-lp-msg-empty" wt-role="msg-empty" wt-sub-html="sMsgEmpty"></div>';
    sHTMLData += '</div>';
    if(g_oALL[sHexOWTId].oDesignData.oParams.bDisplayBlockFooter)
    {
        sHTMLData += '<div class="' + aBlockFooterClasses.join(' ') + '" wt-type="' + g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterLayout + '"';
        if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page" && (g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="bottom" || g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="both"))
        {
            sHTMLData += ' wt-align="' + g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnAlign + '"';
        }
        sHTMLData += '>';
        switch(g_oALL[sHexOWTId].oDesignData.oParams.sBlockFooterLayout)
        {
            case "btns-none":
            case "none-btns":
            case "btns":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                break;
            }
            case "btn-none-btn":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                sHTMLData += '<div class="wt-lp-witemlist-none" wt-role="none"></div>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                break;
            }
            case "link-btns":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkFooterURL!="")
                {
                    sHTMLData += '<a class="' + aFooterLinkClasses.join(' ') + '" wt-role="footer-link" wt-sub-attr="href|sLinkFooterURL" wt-sub-html="sLinkFooterText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aFooterLinkClasses.join(' ') + '" wt-role="footer-link" wt-sub-html="sLinkFooterText"></div>';
                }
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                break;
            }
            case "btn-link-btn":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkFooterURL!="")
                {
                    sHTMLData += '<a class="' + aFooterLinkClasses.join(' ') + '" wt-role="footer-link" wt-sub-attr="href|sLinkFooterURL" wt-sub-html="sLinkFooterText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aFooterLinkClasses.join(' ') + '" wt-role="footer-link" wt-sub-html="sLinkFooterText"></div>';
                }
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                break;
            }
            case "btns-link":
            {
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-prev"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M16.4,29.8l1.5-1.5c0.3-0.3,0.3-0.7,0-1l-9.4-9.5h20.9c0.4,0,0.7-0.3,0.7-0.7v-2.1 c0-0.4-0.3-0.7-0.7-0.7H8.4l9.4-9.5c0.3-0.3,0.3-0.7,0-1l-1.5-1.5c-0.3-0.3-0.7-0.3-1,0L2.2,15.5c-0.3,0.3-0.3,0.7,0,1l13.1,13.3 C15.6,30.1,16.1,30.1,16.4,29.8z"/></svg></span></button>';
                sHTMLData += '<button class="' + aBlockPageBtnClasses.join(' ') + '" wt-role="btn-page-next"><span class="wt-lp-witemlist-page-prev-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path class="st0" d="M15.6,2.4l-1.5,1.5c-0.3,0.3-0.3,0.7,0,1l9.4,9.4H2.7c-0.4,0-0.7,0.3-0.7,0.7v2.1 c0,0.4,0.3,0.7,0.7,0.7h20.9l-9.4,9.4c-0.3,0.3-0.3,0.7,0,1l1.5,1.5c0.3,0.3,0.7,0.3,1,0l13.1-13.1c0.3-0.3,0.3-0.7,0-1L16.6,2.4 C16.4,2.1,15.9,2.1,15.6,2.4z"/></svg></span></button>';
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkFooterURL!="")
                {
                    sHTMLData += '<a class="' + aFooterLinkClasses.join(' ') + '" wt-role="footer-link" wt-sub-attr="href|sLinkFooterURL" wt-sub-html="sLinkFooterText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aFooterLinkClasses.join(' ') + '" wt-role="footer-link" wt-sub-html="sLinkFooterText"></div>';
                }
                break;
            }
            case "link":
            case "none-link":
            case "link-none":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.sLinkFooterURL!="")
                {
                    sHTMLData += '<a class="' + aFooterLinkClasses.join(' ') + '" wt-role="footer-link" wt-sub-attr="href|sLinkFooterURL" wt-sub-html="sLinkFooterText"></a>';
                }
                else
                {
                    sHTMLData += '<div class="' + aFooterLinkClasses.join(' ') + '" wt-role="footer-link" wt-sub-html="sLinkFooterText"></div>';
                }
                break;
            }
            case "pager":
            {
                if(g_oALL[sHexOWTId].oDesignData.oParams.sDisplayType=="page" && (g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="bottom" || g_oALL[sHexOWTId].oDesignData.oParams.oPageBtn.sPageBtnPosition=="both"))
                {
                    sHTMLData += '<ul class="wt-lp-witemlist-pagelist wt-lp-witemlist-pagelist-bottom" wt-role="page-list"></ul>';
                }
                break;
            }
        }

        sHTMLData += '</div>';
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
            { name: "sDistincts", var_name: "distincts", type: "string", def: "" },
            { name: "bHTMLAllowed", var_name: "allow_html", type: "bool", def: false },

            { name: "bCollectFlds", var_name: "collect_flds", type: "bool", def: false },
            { name: "sRemoteActionType", var_name: "remote_action_type", type: "string", def: "object" },
            { name: "iRemoteActionId", var_name: "__remote_action__", type: "int", def: 0 },
            { name: "iRemoteActionCommonId", var_name: "remote_action_common", type: "int", def: 0 },
            { name: "bOverrideNewWindowOnMobile", var_name: "override_new_window_on_mobile", type: "bool", def: false },

            { name: "sLocalAction", var_name: "local_action", type: "string", def: "object" },
            { name: "sLocalVar", var_name: "local_var", type: "string", def: "" },
            { name: "sFunctionName", var_name: "function_name", type: "string", def: "" },
            { name: "sMultipleActionsHeader", var_name: "multiple_actions_header", type: "string", def: "Select action" },
            { name: "sCollectionType", var_name: "collection_type", type: "string", def: "object" },
            { name: "sItemLinkTarget", var_name: "item_link_target", type: "string", def: "_self" },

            { name: "sDisplayType", var_name: "display_type", type: "string", def: "none" },
            { name: "sLoadingType", var_name: "loading_type", type: "string", def: "client" },
            { name: "bDeferredLoading", var_name: "deferred_loading", type: "bool", def: false },
            { name: "iItemsInRow", var_name: "items_in_row", type: "int", def: 1 },
            { name: "iRowsInPart", var_name: "rows_in_part", type: "int", def: 1 },
            { name: "iRowsInPage", var_name: "rows_in_page", type: "int", def: 10 },

            { name: "sActionParams", var_name: "__service__remote_action_params", type: "string", def: "" },
            { name: "sCommonActionParams", var_name: "__service__common_remote_action_params", type: "string", def: "" },
            { name: "sCollectionParams", var_name: "__service__collection_params", type: "string", def: "" },
            { name: "sCommonCollectionParams", var_name: "__service__common_collection_params", type: "string", def: "" },

            { name: "sWhenEmpty", var_name: "when_empty", type: "string", def: "none" },
            { name: "sMsgEmpty", var_name: "msg_empty", type: "string", def: "No data" },
            { name: "sTextMore", var_name: "text_more", type: "string", def: "More..." },

            { name: "sBlockImgLink", var_name: "block_img_link", type: "string", def: "" },
            { name: "sBlockHeaderText", var_name: "block_header_text", type: "string", def: "" },
            { name: "sItemLinkTarget", var_name: "item_link_target", type: "string", def: "_self" },

            { name: "sLinkHeaderURL", var_name: "link_header_url", type: "string", def: "" },
            { name: "sLinkHeaderText", var_name: "link_header_text", type: "string", def: "" },
            { name: "sLinkFooterURL", var_name: "link_footer_url", type: "string", def: "" },
            { name: "sLinkFooterText", var_name: "link_footer_text", type: "string", def: "" },
            { name: "bAllowScrollIntoView", var_name: "allow_scroll_into_view", type: "bool", def: 0 },

            { name: "sImgURLSuffix", var_name: "img_url_suffix", type: "string", def: "" }
        ];
    var aRuntimeItem =
        [
            { name: "bDisplayImg", var_name: "display_img", type: "bool", def: false },
            { name: "bDisplayPreHeader", var_name: "display_preheader", type: "bool", def: false },
            { name: "bDisplaySubHeader1", var_name: "display_subheader1", type: "bool", def: false },
            { name: "bDisplaySubHeader2", var_name: "display_subheader2", type: "bool", def: false },
            { name: "bDisplayBtn1", var_name: "display_btn1", type: "bool", def: true },
            { name: "bDisplayBtn2", var_name: "display_btn2", type: "bool", def: false },
            { name: "bDisplayFloater", var_name: "display_floater", type: "bool", def: false }
        ];
    var aRuntimeBtn1 =
        [
            { name: "sBtnText", var_name: "btn1_text", type: "string", def: "Details" }
        ];
    var aRuntimeBtn2 =
        [
            { name: "sBtnText", var_name: "btn2_text", type: "string", def: "Details" }
        ];
    var aFloater =
        [
            { name: "bFloaterHideEmpty", var_name: "floater_hide_empty", type: "bool", def: true },
            { name: "sFloaterCondition2", var_name: "floater_condition_2", type: "string", def: "" },
            { name: "sFloaterCondition3", var_name: "floater_condition_3", type: "string", def: "" },
            { name: "bFloaterHasBG", var_name: "floater_has_bg", type: "bool", def: true },
            { name: "bFloaterHasBorder", var_name: "floater_has_border", type: "bool", def: false },
            { name: "sColorFloaterBG2", var_name: "color_floater_bg_2", type: "string", def: "#cc0000" },
            { name: "sColorFloaterBG3", var_name: "color_floater_bg_3", type: "string", def: "#ff6600" },
            { name: "sColorFloaterBorder2", var_name: "color_floater_border_2", type: "string", def: "#ffffff" },
            { name: "sColorFloaterBorder3", var_name: "color_floater_border_3", type: "string", def: "#ffffff" },
            { name: "sColorFloaterFont2", var_name: "color_floater_font_2", type: "string", def: "#ffffff" },
            { name: "sColorFloaterFont3", var_name: "color_floater_font_3", type: "string", def: "#ffffff" }
        ];
    g_oALL[sHexOWTId].oRuntimeData =
        {
            sOWTId: sHexOWTId,
            sWTId: sHexWTId,
            aItems: [],
            aResult: [],
            oParams: tools_lp.get_owt_params(curParams, aRuntimeParams, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { aChildren:
                    [
                        { name: "oItem", array: aRuntimeItem },
                        { name: "oBtn1", array: aRuntimeBtn1 },
                        { name: "oBtn2", array: aRuntimeBtn2 },
                        { name: "oFloater", array: aFloater }
                    ], oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } )
        };

    g_oALL[sHexOWTId].oRuntimeData.aItems = [];
    g_oALL[sHexOWTId].oRuntimeData.aResult = [];
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
                        { name: "sImage", var_name: "__mapping__image", type: "string", def: "" },
                        { name: "sPreheader", var_name: "__mapping__preheader", type: "string", def: "" },
                        { name: "sHeader", var_name: "__mapping__header", type: "string", def: "" },
                        { name: "sSubheader1", var_name: "__mapping__subheader1", type: "string", def: "" },
                        { name: "sSubheader2", var_name: "__mapping__subheader2", type: "string", def: "" },
                        { name: "sRtfText", var_name: "__mapping__rtf_text", type: "string", def: "" },
                        { name: "sButtonText1", var_name: "__mapping__button_text1", type: "string", def: "" },
                        { name: "sButtonURL1", var_name: "__mapping__button_url1", type: "string", def: "" },
                        { name: "sButtonText2", var_name: "__mapping__button_text2", type: "string", def: "" },
                        { name: "sButtonURL2", var_name: "__mapping__button_url2", type: "string", def: "" },
                        { name: "sMainURL", var_name: "__mapping__main_url", type: "string", def: "" },
                        { name: "sFloater", var_name: "__mapping__floater", type: "string", def: "" },
                        { name: "sFloaterClass", var_name: "__mapping__css_floater", type: "string", def: "" },
                        { name: "sFloaterColor", var_name: "__mapping__floater_color", type: "string", def: "" },
                        { name: "sImageValue", var_name: "__mapping__image__value", type: "string", def: "" },
                        { name: "sPreheaderValue", var_name: "__mapping__preheader__value", type: "string", def: "" },
                        { name: "sHeaderValue", var_name: "__mapping__header__value", type: "string", def: "" },
                        { name: "sSubheader1Value", var_name: "__mapping__subheader1__value", type: "string", def: "" },
                        { name: "sSubheader2Value", var_name: "__mapping__subheader2__value", type: "string", def: "" },
                        { name: "sRtfTextValue", var_name: "__mapping__rtf_text__value", type: "string", def: "" },
                        { name: "sButtonText1Value", var_name: "__mapping__button_text1__value", type: "string", def: "" },
                        { name: "sButtonURL1Value", var_name: "__mapping__button_url1__value", type: "string", def: "" },
                        { name: "sButtonText2Value", var_name: "__mapping__button_text2__value", type: "string", def: "" },
                        { name: "sButtonURL2Value", var_name: "__mapping__button_url2__value", type: "string", def: "" },
                        { name: "sMainURLValue", var_name: "__mapping__main_url__value", type: "string", def: "" },
                        { name: "sFloaterValue", var_name: "__mapping__floater__value", type: "string", def: "" },
                        { name: "sFloaterClassValue", var_name: "__mapping__css_floater__value", type: "string", def: "" },
                        { name: "sFloaterColorValue", var_name: "__mapping__floater_color__value", type: "string", def: "" }
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
                        { name: "sImage", var_name: "__mapping__image_common", type: "string", def: "" },
                        { name: "sPreheader", var_name: "__mapping__preheader_common", type: "string", def: "" },
                        { name: "sHeader", var_name: "__mapping__header_common", type: "string", def: "" },
                        { name: "sSubheader1", var_name: "__mapping__subheader1_common", type: "string", def: "" },
                        { name: "sSubheader2", var_name: "__mapping__subheader2_common", type: "string", def: "" },
                        { name: "sRtfText", var_name: "__mapping__rtf_text_common", type: "string", def: "" },
                        { name: "sButtonText1", var_name: "__mapping__button_text1_common", type: "string", def: "" },
                        { name: "sButtonURL1", var_name: "__mapping__button_url1_common", type: "string", def: "" },
                        { name: "sButtonText2", var_name: "__mapping__button_text2_common", type: "string", def: "" },
                        { name: "sButtonURL2", var_name: "__mapping__button_url2_common", type: "string", def: "" },
                        { name: "sMainURL", var_name: "__mapping__main_url_common", type: "string", def: "" },
                        { name: "sFloater", var_name: "__mapping__floater_common", type: "string", def: "" },
                        { name: "sFloaterClass", var_name: "__mapping__css_floater_common", type: "string", def: "" },
                        { name: "sFloaterColor", var_name: "__mapping__floater_color_common", type: "string", def: "" },
                        { name: "sImageValue", var_name: "__mapping__image_common__value", type: "string", def: "" },
                        { name: "sPreheaderValue", var_name: "__mapping__preheader_common__value", type: "string", def: "" },
                        { name: "sHeaderValue", var_name: "__mapping__header_common__value", type: "string", def: "" },
                        { name: "sSubheader1Value", var_name: "__mapping__subheader1_common__value", type: "string", def: "" },
                        { name: "sSubheader2Value", var_name: "__mapping__subheader2_common__value", type: "string", def: "" },
                        { name: "sRtfTextValue", var_name: "__mapping__rtf_text_common__value", type: "string", def: "" },
                        { name: "sButtonText1Value", var_name: "__mapping__button_text1_common__value", type: "string", def: "" },
                        { name: "sButtonURL1Value", var_name: "__mapping__button_url1_common__value", type: "string", def: "" },
                        { name: "sButtonText2Value", var_name: "__mapping__button_text2_common__value", type: "string", def: "" },
                        { name: "sButtonURL2Value", var_name: "__mapping__button_url2_common__value", type: "string", def: "" },
                        { name: "sMainURLValue", var_name: "__mapping__main_url_common__value", type: "string", def: "" },
                        { name: "sFloaterValue", var_name: "__mapping__floater_common__value", type: "string", def: "" },
                        { name: "sFloaterClassValue", var_name: "__mapping__css_floater_common__value", type: "string", def: "" },
                        { name: "sFloaterColorValue", var_name: "__mapping__floater_color_common__value", type: "string", def: "" }
                    ];
            }
        }
        g_oALL[sHexOWTId].oRuntimeData.oMapping = tools_lp.get_owt_params(curParams, aMapping, g_oALL[sHexOWTId].sBlockPrefix, g_oALL[sHexOWTId].bPreset, g_oALL[sHexOWTId].oPreset, sOWTId, { oVars: g_oALL[sHexOWTId].oVarsCache, bFromVars: g_oALL[sHexOWTId].bVarsFromCache } );
        g_oALL[sHexOWTId].oRuntimeData.aMap =
            [
                { name_in_item: "header", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sHeader" }) },
                { name_in_item: "rtf_text", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sRtfText" }) },
                { name_in_item: "main_url", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sMainURL" }) },
                { name_in_item: "image", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sImage" }) },
                { name_in_item: "preheader", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sPreheader" }) },
                { name_in_item: "subheader1", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sSubheader1" }) },
                { name_in_item: "subheader2", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sSubheader2" }) },
                { name_in_item: "button_text1", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sButtonText1" }) },
                { name_in_item: "button_url1", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sButtonURL1" }) },
                { name_in_item: "button_text2", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sButtonText2" }) },
                { name_in_item: "button_url2", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sButtonURL2" }) },
                { name_in_item: "floater", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sFloater" }) },
                { name_in_item: "floater_class", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sFloaterClass" }) },
                { name_in_item: "floater_color", in_result: tools_lp.map_param_name({ oMapping: g_oALL[sHexOWTId].oRuntimeData.oMapping, sMapParam: "sFloaterColor" }) }
            ];
    }
    else
    {
        g_oALL[sHexOWTId].oRuntimeData.aItems = tools_web.get_web_param( curParams, (g_oALL[sHexOWTId].sBlockPrefix + ".items"), [], true );
        for(oElem in g_oALL[sHexOWTId].oRuntimeData.aItems)
        {
            oElem.id = oElem.hex_id = tools.random_string(10);
            try { oElem.image = "download_file.js?file_id=" + Int(oElem.image); } catch (e) {}
        }
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
    g_oALL[sHexOWTId].oRuntimeData.bLPE = bLPE;
    var aLegacyRuntimeUpdates =
        [
            { name: "bOverrideNewWindowOnMobile", value: false },
            { name: "sLoadingType", value: "client" },
            { name: "sDistincts", value: "" },
            { name: "bDeferredLoading", value: false },
            { name: "sImgURLSuffix", value: "" },
            { name: "bDisplayFloater", value: false }
        ];
    if(aLegacyRuntimeUpdates.length>0)
    {
        g_oALL[sHexOWTId].oRuntimeData.oParams = tools_lp.update_legacy_params(g_oALL[sHexOWTId].oRuntimeData.oParams, aLegacyRuntimeUpdates);
    }
    g_oALL[sHexOWTId].oRuntimeData.oParams.iPageIndex = OptInt(Request.Query.GetOptProperty("pageindex", 1));
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
        //if(g_oALL[sHexOWTId].oRuntimeData==null) // commented to avoid already localized cache
        {
            g_oALL[sHexOWTId].oRuntimeData = _CUSTOM_BuildRuntimeData();
        }
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
        //if(g_oALL[sHexOWTId].oRuntimeData==null) // commented to avoid already localized cache
        {
            g_oALL[sHexOWTId].oRuntimeData = _CUSTOM_BuildRuntimeData();
        }
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
            var oColData =
                {
                    "type": "collection",
                    "collection_id": g_oALL[sHexOWTId].oRuntimeData.oParams.sHexCollectionId,
                    aVars: g_oALL[sHexOWTId].aColVars,
                    aMap: g_oALL[sHexOWTId].oRuntimeData.aMap,
                    oCollectionParams: g_oALL[sHexOWTId].oRuntimeData.oCollectionParams,
                    loading: g_oALL[sHexOWTId].oRuntimeData.oParams.sLoadingType,
                    "omit_in_fcache": (g_oALL[sHexOWTId].oRuntimeData.oParams.sLoadingType=="server" && g_oALL[sHexOWTId].oRuntimeData.oParams.bDeferredLoading==true),
                    filters: g_oALL[sHexOWTId].oRuntimeData.sFilters,
                    paging: g_oALL[sHexOWTId].oRuntimeData.oPaging,
                    distincts: g_oALL[sHexOWTId].oRuntimeData.sDistincts
                };
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
        if(g_oALL[sHexOWTId].bSaveCache)
        {
            COMMON_SaveCache();
        }
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