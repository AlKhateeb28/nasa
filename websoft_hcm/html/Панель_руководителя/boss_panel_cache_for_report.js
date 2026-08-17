// 7121749858204988969
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function getDominationSubs(xarrMyFuncDomination, _curUserID) {
    var arrDominationSubsIDs = Array();
    var oTemp, catSomeElem, vTemp, arrDeputySubsColls = Array();
    for (catSomeElem in xarrMyFuncDomination) {
        switch (catSomeElem.catalog.Value) {
            case "subdivision":
                arrDominationSubsIDs.push(catSomeElem.object_id.Value);
                break;
            case "position":
                oTemp = catSomeElem.object_id.OptForeignElem;
                if (oTemp != undefined)
                    arrDominationSubsIDs.push(oTemp.parent_object_id.Value);
                break;
            case "collaborator":
                vTemp = catSomeElem.object_id.OptForeignElem;
                if (vTemp != undefined && vTemp.position_parent_id.HasValue) {
                    oTemp = ArrayOptFindByKey(arrDeputySubsColls, vTemp.position_parent_id.Value, "id");
                    if (oTemp == undefined) {
                        oTemp = new Object;
                        oTemp.id = vTemp.position_parent_id.Value;
                        oTemp.people = Array();
                        arrDeputySubsColls.push(oTemp);
                    }
                    oTemp.people.push(vTemp.PrimaryKey);
                }
                break;
        }
    }

    if (bProtectionFromStupid) {
        var oDominationElem, bDomination, iDominatorID;
        var aDestroy = new Array();
        var aDemote = new Array();
        if (ArrayCount(arrDominationSubsIDs) > 1)
            for (oDominationElem in ArrayUnion(arrDominationSubsIDs, arrDeputySubsColls)) {
                bDomination = (DataType(oDominationElem) == "integer");
                if (bDomination)
                    iDominatorID = oDominationElem;
                else
                    iDominatorID = oDominationElem.id;
                catSomeElem = ArrayOptFirstElem(XQuery("for $elem in subdivisions where $elem/id = " + iDominatorID + " return $elem/Fields('id','parent_object_id')"));
                if (catSomeElem != undefined) {
                    while (catSomeElem != undefined) {
                        if (catSomeElem.parent_object_id.HasValue) {
                            if (arrDominationSubsIDs.indexOf(catSomeElem.parent_object_id.Value) >= 0) {
                                if (bDomination) aDestroy.push(iDominatorID); else aDemote.push(iDominatorID);
                                break;
                            }
                            catSomeElem = catSomeElem.parent_object_id.OptForeignElem;
                        } else
                            catSomeElem = undefined;
                    }
                } else if (bDomination) aDestroy.push(iDominatorID); else aDemote.push(iDominatorID);
            }

        if (ArrayOptFirstElem(aDestroy) != undefined)
            arrDominationSubsIDs = ArraySelect(arrDominationSubsIDs, "!StrContains(" + CodeLiteral(ArrayMerge(aDestroy, "This", ";")) + ", This)");
        if (ArrayOptFirstElem(aDemote) != undefined)
            arrDeputySubsColls = ArraySelect(arrDeputySubsColls, "!StrContains(" + CodeLiteral(ArrayMerge(aDemote, "This", ";")) + ", This.id)");

    }

    oTemp = new Object;
    oTemp.a_dominate = arrDominationSubsIDs;
    oTemp.a_depute = arrDeputySubsColls;
    return oTemp;
}

function getSlavePeople(oDominationInfoPARAM, catSubAnchorPARAM, bCompelParticipate) {
    function drillDeeper(_oDominateInfo, _xarrSubsSelection, _catcurSubElem) {
        var _oTempInfo, _aPeople = Array();
        if (_oDominateInfo.a_dominate.indexOf(_catcurSubElem.id) >= 0) {
            _aPeople = ArrayExtract(tools.xquery("for $elem in subs where IsHierChild($elem/id, " + _catcurSubElem.id + ") and $elem/type ='position' and $elem/basic_collaborator_id != null() order by $elem/Hier() return $elem/id,$elem/basic_collaborator_id"), "This.basic_collaborator_id.Value");
        } else {
            _oTempInfo = ArrayOptFindByKey(_oDominateInfo.a_depute, _catcurSubElem.id, "id");

            if (_oTempInfo != undefined) {
                _aPeople = ArrayUnion(_aPeople, _oTempInfo.people);
            }

            var _catChildSubElem;

            var _aDrillingDeeperSelection = XQuery("for $elem in subs where $elem/parent_id= " + _catcurSubElem.PrimaryKey + " and $elem/type = 'subdivision' return $elem/Fields('id')");

            for (_catChildSubElem in _aDrillingDeeperSelection)
                _aPeople = ArrayUnion(_aPeople, drillDeeper(_oDominateInfo, /*_xarrSubsSelection*/ null, _catChildSubElem));
        }

        return _aPeople;
    }

    var _aResultPeople = Array();
    if (bCompelParticipate) {
        _aResultPeople = drillDeeper(oDominationInfoPARAM, /*_xarrSubInvestigate*/ null, catSubAnchorPARAM);
    } else {
        var catChildSubElem;
        for (catChildSubElem in XQuery("for $elem in subs where $elem/parent_id = " + catSubAnchorPARAM.PrimaryKey + " and $elem/type = 'subdivision'  return $elem/Fields('id')"))
            _aResultPeople = ArrayUnion(_aResultPeople, drillDeeper(oDominationInfoPARAM, null, catChildSubElem));
    }

    return XQuery("for $elem in collaborators where MatchSome($elem/id, (" + ArrayMerge(_aResultPeople, "This", ",") + ")) return $elem/Fields('id'," + sXQFileldList + ")")
}

function processResultElem(catElem) {
    var sFld, vTemp, oE = new Object;
    iAFCount = 0;
    oE.id = catElem.id.Value;
    oE.fullname = catElem.fullname.Value;
    for (sFld in aExportFields)
        switch (sFld) {
            case "email":
                oE.SetProperty(sFld, catElem.Child(sFld));
                break;
            case "org_name":
            case "position_name":
            case "position_parent_name":
                oE.SetProperty(sFld, tools_web.get_cur_lng_name(catElem.Child(sFld).Value, curLng.short_id));
                break;
            case "birth_date":
                if (catElem.birth_date.HasValue) {
                    vTemp = Year(CurDate) - Year(catElem.birth_date);
                    if (Month(CurDate) * 100 + Day(CurDate) < Month(catElem.birth_date) * 100 + Day(catElem.birth_date))
                        vTemp = vTemp - 1;

                    vTemp = StrInt(vTemp);
                    oE.SetProperty("aux_title_" + iAFCount, "const=vrb_age");
                    oE.SetProperty("aux_value_" + iAFCount, catElem.Child(sFld));
                } else {
                    oE.SetProperty("aux_title_" + iAFCount, "-");
                }

                iAFCount++;
                break;
            case "hire_date":
            case "position_date":
                if (catElem.Child(sFld).HasValue) {
                    vTemp = ({ "ya": (['let_1', 'god', 'goda']), "v": catElem.Child(sFld).Value });
                    vTemp.rP = ((0.083 * Month(CurDate) + Year(CurDate)) - (0.083 * Month(vTemp.v) + Year(vTemp.v)));
                    vTemp.iP = Int(vTemp.rP);
                    vTemp.iPM = Int((vTemp.rP - vTemp.iP) / 0.083);

                    oE.SetProperty("aux_title_" + iAFCount, "const=" + (sFld == "hire_date" ? "vkompanii" : "nadolzhnosti"));
                    oE.SetProperty("aux_value_" + iAFCount, ((vTemp.iP == 0 ? "" : vTemp.iP + " " + StrNonTitleCase(tools_web.get_web_const(vTemp.ya[IntModType(vTemp.iP)], curLngWeb)) + " ") + vTemp.iPM + " " + StrNonTitleCase(tools_web.get_web_const("mes", curLngWeb))) + " " + StrNonTitleCase(tools_web.get_web_const("t1y74xh7qn", curLngWeb)) + " " + StrDate(vTemp.v, false));
                } else
                    oE.SetProperty("aux_title_" + iAFCount, "-");

                iAFCount++;
                break;
        }

    return oE;
}

var agentId = 7121749858204988969;
var loggerName = "action_7121749858204988969";

try {
    //aCacheData = tools_web.get_user_data("boss_panel_collaborators_cache_for_reports" + curUserID);

    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT ids " +
        " FROM [WTDB].[dbo].cc_boss_cache_ids " +
        " WHERE person_id = " + curUserID +
        "   AND CONVERT(DATE, created_date) >= CONVERT(DATE, DATEADD(DAY,  -1 , GETDATE()))"));

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started.");

    //if (aCacheData == null || !aCacheData.HasProperty("result_array")) {

    addLogMessage(loggerName, "[agent.id: " + agentId + "] User: " + curUserID + " Count: " + ArrayCount(dataList));

    if(ArrayCount(dataList) == 0) {
        iElemId = OptInt(iElemId);

        bAdminAccess == (bAdminAccess == true);

        bHideDismissed = (bHideDismissed == true);

        bSmartSearch = true;
        bProtectionFromStupid = false;

        cut = OptInt(cut, null);

        var sXQFileldList, aExportFields,
            sViewMode = (view_type == "tile" ? "tile" : (is_mobile ? "mobile" : "data_grid"));

        if (sViewMode == "tile") {
            //aExportFields = ['position_parent_name','position_name','email','is_dismiss', 'birth_date', 'hire_date', 'position_date'];
            aExportFields = ['birth_date', 'hire_date', 'position_date'];
        } else if (sViewMode == "mobile") {
            aExportFields = [];
        } else {
            aExportFields = ['position_parent_name', 'position_name', 'email'];
        }

        sXQFileldList = "'fullname'" + (ArrayCount(aExportFields) > 0 ? "," + ArrayMerge(aExportFields, "XQueryLiteral(This)", ",") : "");

        var catSelectedElem, sRole = null;
        var iCurrentUserID = OptInt(curUserID, null);

        if (bAdminAccess && iCurrentUserID != null) {
            catSelectedElem = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/id = " + iCurrentUserID + " return $elem/Fields('id','role_id')"));
            if (catSelectedElem != undefined)
                sRole = catSelectedElem.role_id.Value;
        }

        var arrCollaboratorPack = Array();
        var arrAllFuncMan = Array();

        var xarrMyFuncDominationPack = XQuery("for $elem in func_managers where $elem/person_id = " + XQueryLiteral(iCurrentUserID) + " return $elem/Fields('id','catalog','object_id')");

        for (oxarrMyFuncDominationPack in xarrMyFuncDominationPack) {
            arrAllFuncMan.push(OptInt(oxarrMyFuncDominationPack.object_id));
        }

        if (iElemId != undefined) {
            if (iElemId == 0)
                sObjectType = "all";
            else if (iElemId == 1)
                sObjectType = "candidates";
            else
                sObjectType = OpenDoc(UrlFromDocID(iElemId)).TopElem.Name;

            if (sObjectType == "candidates") {

                if (bAdminAccess && (sRole == "admin" || sRole == "hr")) {
                    arrCollaboratorPack = XQuery("for $elem in collaborators where $elem/is_candidate = true() and $elem/position_id = null() return $elem");
                } else {
                    arrCollIds = XQuery("for $elem in func_managers where $elem/person_id = " + XQueryLiteral(iCurrentUserID) + " and $elem/catalog = 'collaborator' return $elem/Fields('id','object_id')");

                    arrCollaboratorPack = XQuery("for $elem in collaborators where MatchSome( $elem/id, (" + ArrayMerge(arrCollIds, 'This.object_id', ',') + ")) and $elem/is_candidate = true() and $elem/position_id = null() return $elem/Fields('id'," + sXQFileldList + ")");

                }

            } else if (sObjectType != "group" || sObjectType == "all") {

                if (bAdminAccess && (sRole == "admin" || sRole == "hr")) {
                    if (sObjectType != "all") {
                        //arrCollIds = ArraySelect(XQuery("CatalogHierSubset('subs', " + iElemId + ")"), "This.type.Value == 'position' && This.basic_collaborator_id.HasValue");
                        arrCollaboratorPack = tools.xquery("for $elem in subs where IsHierChild($elem/id, " + iElemId + ") and $elem/type = 'position' and $elem/basic_collaborator_id != null() order by $elem/Hier() return $elem/id,$elem/basic_collaborator_id");

                        arrCollaboratorPack = XQuery("for $elem in collaborators where MatchSome($elem/id, (" + ArrayMerge(arrCollaboratorPack, "This.basic_collaborator_id.Value", ",") + ")) return $elem/Fields('id'," + sXQFileldList + ")");

                        //arrCollaboratorPack = QueryCatalogByKeys("collaborators", "id", arrCollIds);
                    } else
                        arrCollaboratorPack = XQuery("for $elem in collaborators return $elem/Fields('id'," + sXQFileldList + ")");
                } else {
                    sQuery = "";
                    if (sObjectType != "all") {
                        sQuery = "for $elem in subs where $elem/id = " + iElemId + " return $elem/Fields('id','type','org_id','parent_id')";
                    } else {
                        sQuery = "for $elem in subs where MatchSome($elem/id,(" + ArrayMerge(arrAllFuncMan, "This", ",") + ")) and $elem/type='org' return $elem/Fields('id','type','org_id','parent_id')";
                    }

                    var arrSelectedSubs = XQuery(sQuery);

                    for (catSelectedElem in arrSelectedSubs) {
                        if (catSelectedElem.type.Value == "org") {
                            if (ArrayOptFindByKey(xarrMyFuncDominationPack, catSelectedElem.PrimaryKey, "object_id") != undefined) {
                                arrCollaboratorPack = ArrayUnion(arrCollaboratorPack, XQuery("for $elem in collaborators where $elem/org_id = " + catSelectedElem.PrimaryKey + " return $elem/Fields('id'," + sXQFileldList + ")"));
                            } else {
                                oDominationInfo = getDominationSubs(xarrMyFuncDominationPack, iCurrentUserID);
                                if (bSmartSearch) {

                                    aSmartCut = XQuery("for $elem in subdivisions where MatchSome($elem/id, (" + ArrayMerge(ArrayUnion(oDominationInfo.a_dominate, ArrayExtract(oDominationInfo.a_depute, "id")), "This", ",") + ")) return $elem/Fields('id','org_id')");

                                    aSmartCut = ArraySelectByKey(aSmartCut, catSelectedElem.PrimaryKey.Value, "org_id");

                                    for (catSub in aSmartCut) {
                                        arrCollaboratorPack = ArrayUnion(arrCollaboratorPack, getSlavePeople(oDominationInfo, catSub, true));
                                    }
                                } else
                                    arrCollaboratorPack = getSlavePeople(oDominationInfo, catSelectedElem, false);
                            }

                        } else if (catSelectedElem.type.Value == "subdivision") {

                            bItsAllClear = false;
                            if (ArrayOptFind(xarrMyFuncDominationPack, "This.object_id.Value == " + catSelectedElem.PrimaryKey + " || This.object_id.Value == " + CodeLiteral(catSelectedElem.org_id.Value)) != undefined) {
                                bItsAllClear = true;
                            } else if (catSelectedElem.parent_id.HasValue) {
                                aDominationInfo = getDominationSubs(xarrMyFuncDominationPack, iCurrentUserID);
                                catParentSub = catSelectedElem;

                                while (catParentSub != undefined) {
                                    if (aDominationInfo.a_dominate.indexOf(catParentSub.PrimaryKey) >= 0) {
                                        bItsAllClear = true;
                                        break;
                                    }
                                    if (catParentSub.parent_id.HasValue)
                                        catParentSub = ArrayOptFirstElem(XQuery("for $elem in subs where $elem/id = " + catParentSub.parent_id.Value + " return $elem/Fields('id','parent_id')"));
                                    else
                                        catParentSub = undefined;
                                }

                                if (bItsAllClear == false) {

                                    if (bSmartSearch) {
                                        oDominationInfo = getDominationSubs(xarrMyFuncDominationPack, iCurrentUserID);

                                        aSmartCut = ArrayUnion(([catSelectedElem]), tools.xquery("for $elem in subdivisions where IsHierChild($elem/id, " + catSelectedElem.PrimaryKey + ") order by $elem/Hier() return $elem/id"));
                                        aSmartCut = ArrayIntersect(aSmartCut, ArrayUnion(oDominationInfo.a_dominate, ArrayExtract(oDominationInfo.a_depute, "id")), "This.id", "This");

                                        for (catSub in aSmartCut) {
                                            arrCollaboratorPack = ArrayUnion(arrCollaboratorPack, getSlavePeople(oDominationInfo, catSub, true));
                                        }
                                    } else
                                        arrCollaboratorPack = getSlavePeople(aDominationInfo, catSelectedElem, true);

                                }
                            }

                            if (bItsAllClear) {
                                arrCollaboratorPack = tools.xquery("for $elem in subs where IsHierChild($elem/id, " + catSelectedElem.id + ") and $elem/type = 'position' and $elem/basic_collaborator_id != null() order by $elem/Hier() return $elem/id,$elem/basic_collaborator_id");

                                arrCollaboratorPack = XQuery("for $elem in collaborators where MatchSome($elem/id, (" + ArrayMerge(arrCollaboratorPack, "This.basic_collaborator_id.Value", ",") + ")) return $elem/Fields('id'," + sXQFileldList + ")");
                            }

                        }
                    }
                }
            } else {
                var arrGroupColls = XQuery("for $elem in group_collaborators where $elem/group_id = " + iElemId + " return $elem/Fields('id','collaborator_id')");

                if (ArrayOptFirstElem(arrGroupColls) != undefined) {
                    arrCollaboratorPack = XQuery("for $elem in collaborators where MatchSome($elem/id, (" + ArrayMerge(arrGroupColls, "This.collaborator_id.Value", ",") + ")) return $elem/Fields('id'," + sXQFileldList + ")");
                }

            }
        }

        var sFilterGist, sFilterData;
        var aXQueryAdd = ([]);


        for (sFilterGist in aFilterGist = Trim(sFilterId).split(",")) {
            switch (StrLeftRange(Trim(sFilterGist), 2)) {
                case "f:":
                    sFilterData = StrRightRangePos(sFilterGist, 2);
                    switch (sFilterData) {
                        case "fired":
                            aXQueryAdd.push("$elem/is_dismiss = true()");
                            break;
                        case "boss":
                            aXQueryAdd.push("some $fm in func_managers satisfies ($elem/id = $fm/person_id)");
                            break;
                        case "operational":
                            if (!bHideDismissed)
                                aXQueryAdd.push("$elem/is_dismiss = false()");
                            break;
                        default:
                            if (StrBegins(sFilterData, "F")) {
                                sFilterData = ArrayOptFind(lists.view_conditions_schemes, "This.catalog.Value == 'collaborator' && This.PrimaryKey == " + CodeLiteral(StrRightRangePos(sFilterData, 1)));
                                if (sFilterData != undefined) {
                                    aXQueryAdd.push(tools.create_filter_xquery(sFilterData.conditions));
                                }
                            }
                            break;
                    }
                    break;
                case "s:":
                    sFilterData = StrRightRangePos(sFilterGist, 2);
                    if (sFilterData == "m" || sFilterData == "w")
                        aXQueryAdd.push("$elem/sex = " + XQueryLiteral(sFilterData));
                    break;
                case "a:":
                    sFilterData = StrRightRangePos(sFilterGist, 2).split("--");
                    if (ArrayCount(sFilterData) == 2) {
                        sFilterData[0] = OptInt(sFilterData[0]);
                        sFilterData[1] = OptInt(sFilterData[1]);
                        if (sFilterData[0] != undefined)
                            aXQueryAdd.push("$elem/birth_date <= date('" + (Year(Date()) - sFilterData[0]) + '-' + StrInt(Month(Date()), 2) + '-' + StrInt(Day(Date()), 2) + "')");
                        if (sFilterData[1] != undefined)
                            aXQueryAdd.push("$elem/birth_date >= date('" + (Year(Date()) - sFilterData[1]) + '-' + StrInt(Month(Date()), 2) + '-' + StrInt(Day(Date()), 2) + "')");
                    }
                    break;
                case "h:":
                    sFilterData = StrRightRangePos(sFilterGist, 2);
                    if (sFilterData != "") {
                        aXQueryAdd.push("$elem/hire_date >= date('" + XmlAttrEncode(sFilterData) + "')");
                    }
                    break;
                case "c:":
                    sFilterData = StrRightRangePos(sFilterGist, 2).split("--");
                    if (ArrayCount(sFilterData) == 2) {
                        sFilterData[0] = ParseDate(Trim(sFilterData[0]));
                        sFilterData[1] = ParseDate(Trim(sFilterData[1]));

                        sQuery = "sql:\
					SELECT\
						col.id,\
						cols.fullname,\
						cols.position_parent_name,\
						cols.position_name,\
						cols.email,\
						CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','date'), 104) create_date \
					FROM\
						collaborators cols\
						INNER JOIN collaborator col ON col.id = cols.id\
					WHERE\
						(cols.code IS NULL OR NOT cols.code LIKE '%muc%')\
						AND CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','datetime2'), 104) >= CONVERT(datetime2, '" + StrDate(sFilterData[0], true, true) + "', 104)\
						AND CONVERT(datetime2, col.data.value('(collaborator/doc_info/creation/date)[1]','datetime2'), 104) <= CONVERT(datetime2, '" + StrDate(sFilterData[1], true, true) + "', 104)\
					ORDER BY fullname\
					";
                        xarrCollabs = XQuery(sQuery);
                        if (ArrayOptFirstElem(xarrCollabs) != undefined) {
                            arrCollabsIds = ArrayExtract(xarrCollabs, "This.id");
                            aXQueryAdd.push("MatchSome( $elem/id, ( " + ArrayMerge(arrCollabsIds, "This", ",") + " ))");
                        }

                    }
                    break;
                case "r:":
                    sFilterData = OptInt(StrRightRangePos(sFilterGist, 2));
                    break;
            }
        }

        if (sSearchWord != "") {
            aXQueryAdd.push("doc-contains($elem/id, '" + DefaultDb + "', '" + sSearchWord + "')");
        }
        if (bHideDismissed)
            aXQueryAdd.push("$elem/is_dismiss = false()");

        var _i;

        if (ArrayOptFirstElem(aXQueryAdd) != undefined) {
            _i = ("for $elem in collaborators where " + ArrayMerge(aXQueryAdd, "This", " and ") + " return $elem/Fields('id')");

            var arrFilteredHumans = ArraySelectAll(XQuery(_i));
            arrCollaboratorPack = ArraySort(arrCollaboratorPack, "id", "+");
            arrFilteredHumans = ArraySort(arrFilteredHumans, "id", "+")
            xarrResult = Array();
            var _i_ac1 = ArrayCount(arrFilteredHumans);
            var _i_ac2 = ArrayCount(arrCollaboratorPack);
            var _j = 0;
            _i = 0;

            while (_i < _i_ac1 && _j < _i_ac2) {
                if (arrFilteredHumans[_i].PrimaryKey == arrCollaboratorPack[_j].PrimaryKey) {
                    xarrResult.push(processResultElem(arrCollaboratorPack[_j]));
                    _i++;
                    _j++;
                } else if (arrFilteredHumans[_i].PrimaryKey > arrCollaboratorPack[_j].PrimaryKey)
                    _j++;
                else
                    _i++;

                if (cut > 0 && _j > cut) // Cut array to not exceed cut
                    break;
            }
        } else {
            if (cut > 0)
                arrCollaboratorPack = ArrayRange(arrCollaboratorPack, 0, cut);
            arrCollaboratorPack = ArraySort(arrCollaboratorPack, "id", "+");
            catColl = ArrayCount(arrCollaboratorPack);

            sFilterGist = null;
            xarrResult = new Array();
            for (_i = 0; _i < catColl; _i++) {
                aXQueryAdd = arrCollaboratorPack[_i];
                if (aXQueryAdd.PrimaryKey.Value != sFilterGist) {
                    sFilterGist = aXQueryAdd.PrimaryKey.Value;
                    xarrResult.push(processResultElem(aXQueryAdd));
                }
            }
        }

        var iStatID = OptInt(statistic_id);

        if (iStatID != undefined) {
            var aStatData;
            for (catColl in xarrResult) {
                aStatData = tools.obtain_statistic_data(statistic_id, catColl.id, null, null, null, true, false);
                catColl.statval = ArrayCount(aStatData);

                if (catColl.statval > 1)
                    catColl.statval = StrReal(ArraySum(aStatData, "value") / catColl.statval, 2);
                else
                    catColl.statval = (catColl.statval == 1 ? StrReal(aStatData[0].value.Value, 2) : null);
            }
        }

        resultList = [];

        var ids = "";
        var step = 1;

        for(id in xarrResult) {
            if(step == 1000) {
                ids = StrCharRangePos(ids,  0, StrCharCount(ids) - 1);
                resultList.push(ids);

                ids = "";
                step = 1;
            }

            ids += id.id + ",";

            step++;
        }

        if(ids != "") {
            ids = StrCharRangePos(ids,  0, StrCharCount(ids) - 1);
            resultList.push(ids);
        }

        //var RESULT = tools_web.set_user_data("boss_panel_collaborators_cache_for_reports" + OptInt(curUserID), ({"result_array": resultList}), 86400);

        saved = 0;

        for(ids in resultList) {
            bossCacheIdsDoc = tools.new_doc_by_name( "cc_boss_cache_id", false );
            bossCacheIdsDoc.BindToDb(DefaultDb);

            bossCacheIdsDocTE = bossCacheIdsDoc.TopElem;

            bossCacheIdsDocTE.person_id = OptInt(curUserID);
            bossCacheIdsDocTE.ids = ids;
            bossCacheIdsDocTE.created_date = Date(StrDate(Date(), false, false) + " 00:00:00");

            bossCacheIdsDoc.Save();

            saved++;
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Added " + saved + " records into 'cc_boss_cache_ids' table for " + curUserID + " person");
    } else {
        dataList = ArrayDirect(XQuery("sql: " +
            " SELECT ids " +
            " FROM [WTDB].[dbo].cc_boss_cache_ids " +
            " WHERE person_id = " + curUserID +
            "   AND CONVERT(DATE, created_date) < CONVERT(DATE, DATEADD(DAY,  -1 , GETDATE()))"));

        deleted = 0;

        for(data in dataList) {
            DeleteDoc(UrlFromDocID(data.id));

            deleted++;
        }

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Deleted " + deleted + " records into 'cc_boss_cache_ids' table for " + curUserID + " person");
    }

    tools_web.set_user_data("boss_panel_collaborators_cache_for_reports" + curUserID, ({ "result_array": xarrResult }), 86400);

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);
}