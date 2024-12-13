// 5751992458745893340
//alert("sCollection="+sCollection); // wt [code] field of a remote_collection
//alert("sCollectionData=" + sCollectionData); // parameters passed to a remote_collection written as url string
//alert("sData=" + sData); //Data, returned by a XAML component; calendar returns {start: ..., end: ...} object; datagrid returns it's table)
//alert("sMode="+ sMode); // "calendar" or "datagrid"
//alert("sType="+ sType); // file type ("pdf" of "")

//alert("sColumnList=" + sColumnList); // List of columns, passes as url
// for calendar: start=[start_source]&end=[end_source]&title=[title_source]&colour=[colour_source]&category=[category_source]
// for datagrid: cN_data=[data_source_of_N_column]&cN_title=[title_source_of_N_column]&cN_width=[width_source_of_N_column]&cN_type=[type_source_of_N_column]&cN_colorsource=[color_source_of_N_column]&... ; non-hidden COLUMNS from collection appended automaticaly; N starts with 1

switch (sType)
{
    case "pdf":
        RESULT.ext = RESULT.header = sType;
        break;
    default:
        RESULT.ext = RESULT.header = "vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
}

var catCollection = ArrayOptFirstElem(tools.xquery("for $elem in remote_collections where $elem/code = " + XQueryLiteral(sCollection) + " return $elem/id,$elem/__data"));

if (catCollection != undefined)
{
    var teCollection = OpenDoc(UrlFromDocID(catCollection.PrimaryKey)).TopElem;
    var _sElement, _sVarName, _sVarValue, fldParam, sDataFormat = "json";

    for (_sElement in String(UrlDecode(sCollectionData)).split("&"))
    {
        _sVarValue = _sElement.indexOf("=");
        if (_sVarValue > 0)
        {
            _sVarName = UrlDecode(StrLeftRange(_sElement, _sVarValue));
            _sVarValue = UrlDecode(StrRightRangePos(_sElement, _sVarValue+1));
            fldParam = ArrayOptFind(teCollection.wvars, "StrLowerCase(This.name) == StrLowerCase(" + CodeLiteral(_sVarName) + ")");
            if (fldParam != undefined)
                fldParam.value = _sVarValue;
        }
    }

    var oColumns = new Object();
    for (_sElement in String(UrlDecode(sColumnList)).split("&"))
    {
        _sVarValue = _sElement.indexOf("=");
        if (_sVarValue > 0)
        {
            _sVarName = UrlDecode(StrLeftRange(_sElement, _sVarValue));
            _sVarValue = UrlDecode(StrRightRangePos(_sElement, _sVarValue+1));
            oColumns.SetProperty(_sVarName, _sVarValue);
        }
    }

    var oCollectionData;
    var oResult;

    switch(sMode)
    {
        case "calendar":
            oData = tools.read_object(sData);
            teCollection.wvars.ObtainChildByKey("start").value = oData.GetOptProperty("start","");
            teCollection.wvars.ObtainChildByKey("end").value = oData.GetOptProperty("end","");
            oResult = teCollection.evaluate(sDataFormat, Request);
            break;
        case "datagrid":
            if (!tools_library.string_is_null_or_empty(sData))
            {
                oResult = ({'error': 0, 'messageText': 'ok', 'total': 0, 'columns': ([]), 'result': sData})
            }
            else
            {
                oResult = teCollection.evaluate(sDataFormat, Request);
            }
            break;
    }


    if (oResult.error == 0)
    {
        var aResults = tools.read_object(oResult.result);
        var bsResultHTML = new BufStream;
        bsResultHTML.WriteStr('<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><meta name="ProgId" content="Excel.Sheet"/><meta name="Generator" content="Microsoft Excel 11"/></head><body><table border="1" cellpadding="2" cellspacing="0">');

        switch (sMode)
        {
            case "calendar":

                var oEvent;

                if (oColumns.GetOptProperty("start","") == "")
                    oColumns.start = "start";
                if (oColumns.GetOptProperty("end","") == "")
                    oColumns.end = "end";
                if (oColumns.GetOptProperty("title","") == "")
                    oColumns.title = "title";
                if (oColumns.GetOptProperty("color","") == "")
                    oColumns.color = "color";
                if (oColumns.GetOptProperty("category","") == "")
                    oColumns.category = "category";

                var bPreserveTime = (oData.mode == "day");

                var vTemp, aTemp = new Array();
                for (oEvent in aResults)
                {
                    if (oEvent.HasProperty(oColumns.start))
                    {
                        vTemp = tools.opt_date(oEvent.GetProperty(oColumns.start));
                        if (vTemp != undefined)
                        {
                            if (!bPreserveTime)
                                vTemp = DateNewTime(vTemp);
                            oEvent.SetProperty(oColumns.start, vTemp);
                            if (oEvent.HasProperty(oColumns.end))
                            {
                                vTemp = tools.opt_date(oEvent.GetProperty(oColumns.end), oEvent.GetProperty(oColumns.start));
                                if (!bPreserveTime)
                                    vTemp = DateNewTime(vTemp);
                            }
                            else
                                vTemp = oEvent.GetProperty(oColumns.start);

                            oEvent.SetProperty(oColumns.end, vTemp);
                            aTemp.push(oEvent);
                        }
                    }
                }
                aResults = aTemp;
                switch (oData.mode)
                {
                    case "day":
                        var dCurrentDate;
                        try
                        {
                            dCurrentDate = Date(oData.date);
                        }
                        catch(_X_)
                        {
                            dCurrentDate = new Date();
                        }

                        var aEvents = ArraySelect(aResults, ("This." + oColumns.start + " <= " + CodeLiteral(DateNewTime(dCurrentDate, 23, 59 ,59)) + " && (This." + oColumns.end + " == undefined || This." + oColumns.end + " >= " + CodeLiteral(DateNewTime(dCurrentDate, 0,0,0)) + ")"));

                        for (oEvent in ArraySort(aEvents, oColumns.start, "+", oColumns.end, "+"))
                        {
                            bsResultHTML.WriteStr("<tr><td>" +oEvent.GetOptProperty(oColumns.start)+ "</td><td>" +oEvent.GetOptProperty(oColumns.end)+ "</td><td>" + oEvent.GetOptProperty(oColumns.title,"Invalid field " + oColumns.title) + "</td></tr>");
                        }
                        break;
                    case "week":
                        var iWeekDay, dStartDate, dEndDate, dCurrentDate;
                        try
                        {
                            dStartDate = DateNewTime(Date(oData.start));
                            dCurrentDate = DateNewTime(Date(oData.date));
                            dEndDate = DateNewTime(Date(oData.end));
                            iWeekDay = WeekDay(dCurrentDate) - 1;
                        }
                        catch(_X_)
                        {
                            dCurrentDate = DateNewTime(new Date());
                            iWeekDay = WeekDay(dCurrentDate) - 1;
                            if (iWeekDay < 0) iWeekDay = 6;
                            dStartDate = DateOffset(dCurrentDate, 0 - (86400 * iWeekDay));
                            dEndDate = DateOffset(dCurrentDate, 86400 * (6 - iWeekDay));
                        }
                        dSupportDate = new Date(dStartDate);
                        var iLen, aEvents = ArraySelect(aResults, "This." + oColumns.start + " <= " + CodeLiteral(dEndDate) + " && This." + oColumns.end + " >= " + CodeLiteral(dStartDate));
                        bsResultHTML.WriteStr('<thead><tr><th width="150px">' + tools_web.get_web_const( 'pn', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'vt', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'sr', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'cht', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'pt', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'sb', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'vs', curLngWeb ) + '</th></tr></thead><tbody><tr>');
                        for (i = 0; i < 7; i++)
                        {
                            bsResultHTML.WriteStr('<td style="background-color: gray">' + Day(dSupportDate) + "</td>");
                            dSupportDate = DateOffset(dSupportDate, 86400);
                        }
                        bsResultHTML.WriteStr("</tr>");
                        var dEventBegin, dEventEnd;
                        for (oEvent in aEvents)
                        {
                            dSupportDate = new Date(dStartDate);
                            dEventBegin = oEvent.GetOptProperty(oColumns.start);
                            if (dEventBegin < dSupportDate)
                                dEventBegin = dSupportDate;
                            dEventEnd = oEvent.GetOptProperty(oColumns.end);
                            if (dEventEnd > dEndDate)
                                dEventEnd = dEndDate;

                            bsResultHTML.WriteStr("<tr>");
                            for (i = 0; i < 7; i++)
                            {
                                if (dEventBegin == dSupportDate)
                                {
                                    iLen = (DateToRawSeconds(dEventEnd) - DateToRawSeconds(dEventBegin)) / 86400 + 1;
                                    if (iLen > 0)
                                    {
                                        bsResultHTML.WriteStr('<td colspan="' +iLen+ '" style="background-color: ' +oEvent.GetOptProperty(oColumns.color, "white")+ '">' + oEvent.GetOptProperty(oColumns.title) + "</td>");
                                        i += iLen;
                                    }
                                }
                                else
                                {
                                    bsResultHTML.WriteStr("<td>&nbsp;</td>");
                                }
                                dSupportDate = DateOffset(dSupportDate, 86400);
                            }
                            bsResultHTML.WriteStr("</tr>");
                        }

                        bsResultHTML.WriteStr("</tbody>");
                        break;
                    case "month":
                        var iWeekDay, dStartDate, dEndDate, dCurrentDate;
                        try
                        {
                            dStartDate = DateNewTime(Date(oData.start));
                            dCurrentDate = DateNewTime(Date(oData.date));
                            dEndDate = DateNewTime(Date(oData.end));
                        }
                        catch(_X_)
                        {
                            dCurrentDate = DateNewTime(new Date());
                            iWeekDay = WeekDay(dCurrentDate) - 1;
                            if (iWeekDay < 0) iWeekDay = 6;
                            dStartDate = DateOffset(dCurrentDate, 0 - (86400 * iWeekDay));
                            dEndDate = DateOffset(dCurrentDate, 86400 * 7 * 6 );
                        }

                        var iLen, aEvents = ArraySelect(aResults, "This." + oColumns.start + " <= " + CodeLiteral(dEndDate) + " && This." + oColumns.end + " >= " + CodeLiteral(dStartDate));

                        bsResultHTML.WriteStr('<thead><tr><th width="150px">' + tools_web.get_web_const( 'pn', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'vt', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'sr', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'cht', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'pt', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'sb', curLngWeb ) + '</th><th width="150px">' + tools_web.get_web_const( 'vs', curLngWeb ) + '</th></tr></thead><tbody>');
                        var j, dEventBegin, dEventEnd;
                        var dPeriodStart = dStartDate;
                        var dPeriodEnd = DateOffset(dStartDate, 86400 * 6);
                        for (j = 0; j < 6; j++)
                        {
                            dSupportDate = new Date(dPeriodStart);
                            bsResultHTML.WriteStr("<tr>");
                            for (i = 0; i < 7; i++)
                            {
                                bsResultHTML.WriteStr('<td style="background-color: gray">' + Day(dSupportDate) + "</td>");
                                dSupportDate = DateOffset(dSupportDate, 86400);
                            }
                            bsResultHTML.WriteStr("</tr>");
                            for (oEvent in aEvents)
                            {
                                dSupportDate = new Date(dPeriodStart);
                                dEventBegin = oEvent.GetOptProperty(oColumns.start);
                                if (dEventBegin < dPeriodStart)
                                    dEventBegin = dPeriodStart;
                                dEventEnd = oEvent.GetOptProperty(oColumns.end);
                                if (dEventEnd > dPeriodEnd)
                                    dEventEnd = dPeriodEnd;
                                bsResultHTML.WriteStr("<tr>");

                                if (dEventBegin > dPeriodEnd || dEventEnd < dPeriodStart)
                                {
                                    for (i = 0; i < 7; i++)
                                        bsResultHTML.WriteStr("<td>&nbsp;</td>");
                                }
                                else for (i = 0; i < 7; i++)
                                {
                                    if (dEventBegin <= dSupportDate && dEventEnd >= dSupportDate)
                                    {
                                        /*
                                        iLen = (DateToRawSeconds(dEventEnd) - DateToRawSeconds(dEventBegin)) / 86400 + 1;
                                        if (iLen > 0)
                                        {
                                            bsResultHTML.WriteStr('<td colspan="' +iLen+ '" style="background-color: ' +oEvent.GetOptProperty(oColumns.color, "white")+ '">' + oEvent.GetOptProperty(oColumns.title) + "</td>");
                                            i += iLen;
                                        }
                                        */
                                        bsResultHTML.WriteStr('<td style="background-color: ' +oEvent.GetOptProperty(oColumns.color, "white")+ '">' + oEvent.GetOptProperty(oColumns.title) + "</td>");
                                    }
                                    else
                                    {
                                        bsResultHTML.WriteStr("<td>&nbsp;</td>");
                                    }
                                    dSupportDate = DateOffset(dSupportDate, 86400);
                                }
                                bsResultHTML.WriteStr("</tr>");
                            }

                            dPeriodStart = DateOffset(dPeriodStart, 86400 * 7);
                            dPeriodEnd = DateOffset(dPeriodEnd, 86400 * 7);
                        }
                        bsResultHTML.WriteStr("</tbody>");


                        break;
                    case "category":
                    default:
                        var dStartDate, dEndDate;
                        try
                        {
                            dStartDate = DateNewTime(Date(oData.start));
                            dEndDate = DateNewTime(Date(oData.end));
                        }
                        catch(_X_)
                        {
                            ERROR = 1;
                            MESSAGE = tools_web.get_web_const( 'nevernyyperiod', curLngWeb );
                            Cancel();
                        }

                        var dSupportDate = new Date(dStartDate);
                        var i, j, aEvents = ArraySelect(aResults, "This." + oColumns.start + " <= " + CodeLiteral(dEndDate) + " && This." + oColumns.end + " >= " + CodeLiteral(dStartDate));

                        var oEventMeta, oCategory, aCategories = new Array();
                        var aEventsMeta = Array();

                        aTemp = ArraySelectDistinct(aEvents, "This.GetOptProperty(" +CodeLiteral(oColumns.category)+ ") + '' + This.GetOptProperty(" +CodeLiteral(oColumns.title)+ ")");
                        for (oEvent in aTemp)
                        {
                            oEventMeta = new Object;
                            oEventMeta.title = oEvent.GetOptProperty(oColumns.title,"");
                            oEventMeta.category = oEvent.GetOptProperty(oColumns.category);
                            oEventMeta.events = ArraySelect(aEvents, "This.GetOptProperty(" +CodeLiteral(oColumns.category)+ ") == " +CodeLiteral(oEvent.GetOptProperty(oColumns.category))+ " && This.GetOptProperty(" +CodeLiteral(oColumns.title)+ ") == " + CodeLiteral(oEvent.GetOptProperty(oColumns.title)));
                            aEventsMeta.push(oEventMeta);
                        }

                        aTemp = ArraySelectDistinct(aEventsMeta, "This.category");
                        var bCategories = (aTemp.length != 1 || aTemp[0].category != undefined);
                        if (bCategories)
                        {
                            for (oCategory in aTemp)
                            {
                                aCategories.push(({"name": oCategory.category, "events" : ArraySelect(aEventsMeta, "This.category == " +CodeLiteral(oCategory.category))}));
                            }
                        }
                        else
                        {
                            aCategories.push(({"name": undefined, "events" : aEventsMeta}));
                        }

                        bsResultHTML.WriteStr('<thead><tr>');
                        if (bCategories)
                            bsResultHTML.WriteStr('<td style="background-color: gray"></td>');
                        bsResultHTML.WriteStr('<td style="background-color: gray"></td>');

                        for (dSupportDate = new Date(dStartDate); dSupportDate <= dEndDate; dSupportDate = DateOffset(dSupportDate, 86400))
                        {
                            bsResultHTML.WriteStr('<td style="background-color: gray">' + Day(dSupportDate) + "</td>");
                        }
                        bsResultHTML.WriteStr('</tr></thead>');

                        bsResultHTML.WriteStr("<tbody>");
                        aTemp = Array();
                        vTemp = null;
                        for (oCategory in aCategories)
                        {
                            bsResultHTML.WriteStr("<tr>");
                            if (bCategories)
                            {
                                bsResultHTML.WriteStr('<td rowspan="' +oCategory.events.length+ '" valign="top">' + oCategory.name + '</td>');
                            }
                            i = 0;
                            for (oEventMeta in oCategory.events)
                            {
                                if (i > 0)
                                    bsResultHTML.WriteStr("<tr>");
                                bsResultHTML.WriteStr('<td>' + oEventMeta.title + '</td>');


                                for (dSupportDate = new Date(dStartDate); dSupportDate <= dEndDate; dSupportDate = DateOffset(dSupportDate, 86400))
                                {
                                    j = 0;
                                    for (oEvent in oEventMeta.events)
                                    {
                                        if (oEvent.GetOptProperty(oColumns.start) <= dSupportDate && oEvent.GetOptProperty(oColumns.end) >= dSupportDate)
                                        {
                                            j++;
                                            vTemp = oEvent.GetOptProperty(oColumns.color, "white");
                                        }
                                    }
                                    if (j > 0)
                                    {
                                        bsResultHTML.WriteStr('<td style="background-color: ' +vTemp+ '">' + j + "</td>");
                                        aTemp = Array();
                                        vTemp = null;
                                    }
                                    else
                                        bsResultHTML.WriteStr("<td>&nbsp;");
                                    bsResultHTML.WriteStr("</td>");
                                }

                                i++;
                                bsResultHTML.WriteStr("</tr>");
                            }
                        }
                        bsResultHTML.WriteStr("</tbody>");

                        break;

                }

                break;
            case "datagrid":
                var i = 1;
                var aColumnsList = Array();
                var oColumn = oColumns.GetOptProperty("c" + i + "_data", "");
                while (oColumn != "")
                {
                    aColumnsList.push({"data": oColumn, "title": (oColumns.GetOptProperty("c" + i + "_title", "")), "width": (oColumns.GetOptProperty("c" + i + "_width", null)), "type": (oColumns.GetOptProperty("c" + i + "_type", "string")), "colorsource": (oColumns.GetOptProperty("c" + i + "_colorsource", null))});
                    i++;
                    oColumn = oColumns.GetOptProperty("c" + i + "_data", "");
                }
                aColumnsList = ArrayUnion(aColumnsList, ArraySelect(tools.read_object(oResult.columns), "This.GetOptProperty('hidden') != true"));


                bsResultHTML.WriteStr('<thead><tr>');
                for (oColumn in aColumnsList)
                {
                    bsResultHTML.WriteStr('<th');
                    if (oColumn.GetOptProperty("width", null) != null)
                        bsResultHTML.WriteStr(' width="' +OptInt(oColumn.width, 100)+ '"');
                    bsResultHTML.WriteStr('>' + oColumn.GetOptProperty("title", "") + '</th>');
                }
                bsResultHTML.WriteStr('</tr></thead><tbody>');

                for (oResult in aResults)
                {
                    bsResultHTML.WriteStr('<tr>');
                    for (oColumn in aColumnsList)
                    {
                        bsResultHTML.WriteStr('<td');
                        i = oColumn.GetOptProperty("colorsource", null);
                        if (i != null)
                        {
                            if (!StrBegins(i, "#"))
                                i = oResult.GetOptProperty(i,null);
                            if (i != null)
                                bsResultHTML.WriteStr(' style="background-color: ' +i+ '"');
                        }
                        bsResultHTML.WriteStr('>');
                        switch (oColumn.GetOptProperty("type"))
                        {
                            case "button":
                                break;
                            default:
                                bsResultHTML.WriteStr(oResult.GetOptProperty(oColumn.data,""));
                        }
                        bsResultHTML.WriteStr('</td>');
                    }
                    bsResultHTML.WriteStr('</tr>');
                }
                bsResultHTML.WriteStr('</tbody>');

                break;
            default:
                ERROR = 1;
                MESSAGE = tools_web.get_web_const( 'neopoznannyyre', curLngWeb ) + ': ' + CodeLiteral(sMode);
                Cancel();
        }
        bsResultHTML.WriteStr("</table></body></html>");

        var sUrl = 'c' +catCollection.PrimaryKey + 'u'+ curUserID;
        PutUrlData(UrlAppendPath("x-local://trash/temp/", sUrl + ".html"), bsResultHTML.DetachStr());
        RESULT.xls_url = sUrl;
    }
    else
    {
        ERROR = 1;
        MESSAGE = tools_web.get_web_const( 'oshibkavvyborke', curLngWeb ) + ' ' + CodeLiteral(teCollection.name);
    }
}
else
{
    ERROR = 1;
    MESSAGE = tools_web.get_web_const( 'nevernyykodvyb', curLngWeb );
}