// 7121749858204988969

aCacheData = tools_web.get_user_data("boss_panel_collaborators_cache_for_reports" + curUserID);

if (!(aCacheData != null && aCacheData.HasProperty("result_array")))
    if (true) {

        iElemId = OptInt(iElemId);

        bAdminAccess == (bAdminAccess == true);

        bHideDismissed = (bHideDismissed == true);

        bSmartSearch = true;
        bProtectionFromStupid = false;

        cut = OptInt(cut, null);

        var sXQFileldList, aExportFields, sViewMode = (view_type == "tile" ? "tile" : (is_mobile ? "mobile" : "data_grid"));

        if (sViewMode == "tile") {
            //aExportFields = ['position_parent_name','position_name','email','is_dismiss', 'birth_date', 'hire_date', 'position_date'];
            aExportFields = ['birth_date', 'hire_date', 'position_date'];
        }
        else if (sViewMode == "mobile") {
            aExportFields = [];
        }
        else {
            aExportFields = ['position_parent_name', 'position_name', 'email'];
        }

        sXQFileldList = "'fullname'" + (ArrayCount(aExportFields) > 0 ? "," + ArrayMerge(aExportFields, "XQueryLiteral(This)", ",") : "");

        function infologger(sText) {
            SetCurThreadDesc(sText);
            alert("<" + curUser.fullname + "> " + sText);
        }

        // infologger("0. Setting logger fn"); var _nameCacheO = new Object;function _namecache(sID) { var _retName = _nameCacheO.GetOptProperty(sID + ''); if (_retName != undefined) { return _retName; } else { _retName = tools.open_doc(_retName); if (_retName != undefined) { if (_retName.TopElem.ChildExists("name")) { _retName = _retName.TopElem.name.Value; _nameCacheO.SetProperty(sID + '', _retName); } else _retName = undefined; } return _retName; } }

        var catSelectedElem, sRole = null;
        var iCurrentUserID = OptInt(curUserID, null);

        if (bAdminAccess && iCurrentUserID != null) {
            catSelectedElem = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/id = " + iCurrentUserID + " return $elem/Fields('id','role_id')"));
            if (catSelectedElem != undefined)
                sRole = catSelectedElem.role_id.Value;
        }

        //catCurrentUser.role_id == "admin" || catCurrentUser.role_id == "hr")
        // infologger("1. Starting search;  iElemId = [" + iElemId + "]" +_namecache(iElemId)+ "; curUserID=" + iCurrentUserID);

        var arrCollaboratorPack = Array();
        var arrAllFuncMan = Array();

        var xarrMyFuncDominationPack = XQuery("for $elem in func_managers where $elem/person_id = " + XQueryLiteral(iCurrentUserID) + " return $elem/Fields('id','catalog','object_id')");

        for (oxarrMyFuncDominationPack in xarrMyFuncDominationPack) {
            arrAllFuncMan.push(OptInt(oxarrMyFuncDominationPack.object_id));
        }

        function processResultElem(catElem) {
            var sFld, vTemp, oE = new Object;
            iAFCount = 0;
            oE.id = catElem.id.Value;
            oE.fullname = catElem.fullname.Value;
            for (sFld in aExportFields)
                switch (sFld) {
                    case "email":
                        oE.SetProperty(sFld, catElem.Child(sFld)); break;
                        break;
                    case "org_name":
                    case "position_name":
                    case "position_parent_name":
                        oE.SetProperty(sFld, tools_web.get_cur_lng_name(catElem.Child(sFld).Value, curLng.short_id)); break;
                    case "birth_date":
                        if (catElem.birth_date.HasValue) {
                            vTemp = Year(CurDate) - Year(catElem.birth_date);
                            if (Month(CurDate) * 100 + Day(CurDate) < Month(catElem.birth_date) * 100 + Day(catElem.birth_date))
                                vTemp = vTemp - 1;

                            vTemp = StrInt(vTemp);
                            oE.SetProperty("aux_title_" + iAFCount, "const=vrb_age");
                            oE.SetProperty("aux_value_" + iAFCount, catElem.Child(sFld));
                        }
                        else {
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
                        }
                        else
                            oE.SetProperty("aux_title_" + iAFCount, "-");

                        iAFCount++;
                        break;
                }

            return oE;
        }

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
                // infologger("x.0 Duplicate check");
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
                                }
                                else
                                    catSomeElem = undefined;
                            }
                        }
                        else
                        if (bDomination) aDestroy.push(iDominatorID); else aDemote.push(iDominatorID);
                    }

                // infologger("x.1 Duplicate destroy: domination - " + ArrayMerge(aDestroy, "This", ";") + "; demotion - " + ArrayMerge(aDemote, "This", ";"));

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
            // infologger("1.00 Getting slave people; sub_anchor = [" +catSubAnchorPARAM.PrimaryKey+ "]" +_namecache(catSubAnchorPARAM.PrimaryKey)); var iIteraion = 0;

            function drillDeeper(_oDominateInfo, _xarrSubsSelection, _catcurSubElem) {
                // infologger("1.10 Drill iteration " + (iIteraion++) + ";  for sub_anchor [" + catSubAnchorPARAM.PrimaryKey + "]"+_namecache(catSubAnchorPARAM.PrimaryKey)+"; catcurSubElemID = " + _catcurSubElem.id);

                // infologger("1.11 Drill iteration " +iIteraion+ "");
                var _oTempInfo, _aPeople = Array();
                if (_oDominateInfo.a_dominate.indexOf(_catcurSubElem.id) >= 0) {
                    // infologger("1.12a Drill iteration " +iIteraion+ "");
                    //_aPeople = ArraySelect(XQuery("CatalogHierSubset('subs', " + _catcurSubElem.id + ")"), "This.type.Value == 'position' && This.basic_collaborator_id.HasValue");
                    _aPeople = ArrayExtract(tools.xquery("for $elem in subs where IsHierChild($elem/id, " + _catcurSubElem.id + ") and $elem/type ='position' and $elem/basic_collaborator_id != null() order by $elem/Hier() return $elem/id,$elem/basic_collaborator_id"), "This.basic_collaborator_id.Value");
                }
                else {
                    // infologger("1.12b Drill iteration " +iIteraion+ "");
                    _oTempInfo = ArrayOptFindByKey(_oDominateInfo.a_depute, _catcurSubElem.id, "id");
                    // infologger("1.13b Drill iteration " +iIteraion+ "");
                    if (_oTempInfo != undefined) {
                        // infologger("1.140 Drill iteration " +iIteraion+ "");
                        _aPeople = ArrayUnion(_aPeople, _oTempInfo.people);
                    }
                    // infologger("1.15 Drill iteration " +iIteraion+ "");
                    var _catChildSubElem;

                    var _aDrillingDeeperSelection = XQuery("for $elem in subs where $elem/parent_id= " + _catcurSubElem.PrimaryKey + " and $elem/type = 'subdivision' return $elem/Fields('id')");
                    // infologger("1.16 Drill iteration " +iIteraion+ " (" +ArrayCount(_aDrillingDeeperSelection)+ ")");
                    for (_catChildSubElem in _aDrillingDeeperSelection)
                        _aPeople = ArrayUnion(_aPeople, drillDeeper(_oDominateInfo, /*_xarrSubsSelection*/ null, _catChildSubElem));
                }
                // infologger("1.17x Got slaves: " + ArrayCount(_aPeople));

                return _aPeople;
            }

            var _aResultPeople = Array();
            if (bCompelParticipate) {
                _aResultPeople = drillDeeper(oDominationInfoPARAM, /*_xarrSubInvestigate*/ null, catSubAnchorPARAM);
            }
            else {
                var catChildSubElem;
                for (catChildSubElem in XQuery("for $elem in subs where $elem/parent_id = " + catSubAnchorPARAM.PrimaryKey + " and $elem/type = 'subdivision'  return $elem/Fields('id')"))
                    _aResultPeople = ArrayUnion(_aResultPeople, drillDeeper(oDominationInfoPARAM, null, catChildSubElem));
            }

            return XQuery("for $elem in collaborators where MatchSome($elem/id, (" + ArrayMerge(_aResultPeople, "This", ",") + ")) return $elem/Fields('id'," + sXQFileldList + ")")

            //return QueryCatalogByKeys("collaborators", "id", _aResultPeople);
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
                }
                else {
                    arrCollIds = XQuery("for $elem in func_managers where $elem/person_id = " + XQueryLiteral(iCurrentUserID) + " and $elem/catalog = 'collaborator' return $elem/Fields('id','object_id')");

                    arrCollaboratorPack = XQuery("for $elem in collaborators where MatchSome( $elem/id, (" + ArrayMerge(arrCollIds, 'This.object_id', ',') + ")) and $elem/is_candidate = true() and $elem/position_id = null() return $elem/Fields('id'," + sXQFileldList + ")");

                }

            }
            else if (sObjectType != "group" || sObjectType == "all") {

                if (bAdminAccess && (sRole == "admin" || sRole == "hr")) {
                    if (sObjectType != "all") {
                        //arrCollIds = ArraySelect(XQuery("CatalogHierSubset('subs', " + iElemId + ")"), "This.type.Value == 'position' && This.basic_collaborator_id.HasValue");
                        arrCollaboratorPack = tools.xquery("for $elem in subs where IsHierChild($elem/id, " + iElemId + ") and $elem/type = 'position' and $elem/basic_collaborator_id != null() order by $elem/Hier() return $elem/id,$elem/basic_collaborator_id");

                        arrCollaboratorPack = XQuery("for $elem in collaborators where MatchSome($elem/id, (" + ArrayMerge(arrCollaboratorPack, "This.basic_collaborator_id.Value", ",") + ")) return $elem/Fields('id'," + sXQFileldList + ")");

                        //arrCollaboratorPack = QueryCatalogByKeys("collaborators", "id", arrCollIds);
                    }
                    else
                        arrCollaboratorPack = XQuery("for $elem in collaborators return $elem/Fields('id'," + sXQFileldList + ")");
                }
                else {
                    sQuery = "";
                    if (sObjectType != "all") {
                        sQuery = "for $elem in subs where $elem/id = " + iElemId + " return $elem/Fields('id','type','org_id','parent_id')";
                    }
                    else {
                        sQuery = "for $elem in subs where MatchSome($elem/id,(" + ArrayMerge(arrAllFuncMan, "This", ",") + ")) and $elem/type='org' return $elem/Fields('id','type','org_id','parent_id')";
                    }

                    // infologger("1.1 Search subs;  sQuery = " + sQuery + "; sObjectType = " + sObjectType);
                    var arrSelectedSubs = XQuery(sQuery);
                    // infologger("1.1a arrSelectedSubs=" + ArrayCount(arrSelectedSubs));
                    var oDominationInfoPARAM;

                    for (catSelectedElem in arrSelectedSubs) {
                        // infologger("1.1f catSelectedElem=" + catSelectedElem.id);

                        if (catSelectedElem.type.Value == "org") {

                            if (ArrayOptFindByKey(xarrMyFuncDominationPack, catSelectedElem.PrimaryKey, "object_id") != undefined) {
                                arrCollaboratorPack = ArrayUnion(arrCollaboratorPack, XQuery("for $elem in collaborators where $elem/org_id = " + catSelectedElem.PrimaryKey + " return $elem/Fields('id'," + sXQFileldList + ")"));
                            }
                            else {
                                oDominationInfo = getDominationSubs(xarrMyFuncDominationPack, iCurrentUserID);
                                if (bSmartSearch) {

                                    aSmartCut = XQuery("for $elem in subdivisions where MatchSome($elem/id, (" + ArrayMerge(ArrayUnion(oDominationInfo.a_dominate, ArrayExtract(oDominationInfo.a_depute, "id")), "This", ",") + ")) return $elem/Fields('id','org_id')");

                                    aSmartCut = ArraySelectByKey(aSmartCut, catSelectedElem.PrimaryKey.Value, "org_id");
                                    // infologger("1.1s aSmartCut=" + ArrayCount(aSmartCut));
                                    for (catSub in aSmartCut) {
                                        arrCollaboratorPack = ArrayUnion(arrCollaboratorPack, getSlavePeople(oDominationInfo, catSub, true));
                                    }
                                }
                                else
                                    arrCollaboratorPack = getSlavePeople(oDominationInfo, catSelectedElem, false);
                            }

                        }
                        else if (catSelectedElem.type.Value == "subdivision") {

                            bItsAllClear = false;
                            if (ArrayOptFind(xarrMyFuncDominationPack, "This.object_id.Value == " + catSelectedElem.PrimaryKey + " || This.object_id.Value == " + CodeLiteral(catSelectedElem.org_id.Value)) != undefined) {
                                bItsAllClear = true;
                            }
                            else if (catSelectedElem.parent_id.HasValue) {
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
                                        // infologger("1.1ss aSmartCut=" + ArrayCount(aSmartCut));
                                        for (catSub in aSmartCut) {
                                            arrCollaboratorPack = ArrayUnion(arrCollaboratorPack, getSlavePeople(oDominationInfo, catSub, true));
                                        }
                                    }
                                    else
                                        arrCollaboratorPack = getSlavePeople(aDominationInfo, catSelectedElem, true);

                                }
                            }

                            if (bItsAllClear) {
                                arrCollaboratorPack = tools.xquery("for $elem in subs where IsHierChild($elem/id, " + catSelectedElem.id + ") and $elem/type = 'position' and $elem/basic_collaborator_id != null() order by $elem/Hier() return $elem/id,$elem/basic_collaborator_id");

                                arrCollaboratorPack = XQuery("for $elem in collaborators where MatchSome($elem/id, (" + ArrayMerge(arrCollaboratorPack, "This.basic_collaborator_id.Value", ",") + ")) return $elem/Fields('id'," + sXQFileldList + ")");
                                // infologger("1.1nw clear pack generated: count " + ArrayCount(arrCollaboratorPack));

                            }

                        }
                    }

                    // infologger("1.2 Subs processed");
                }
            }
            else {
                // infologger("1.1 Search groups");
                var arrGroupColls = XQuery("for $elem in group_collaborators where $elem/group_id = " + iElemId + " return $elem/Fields('id','collaborator_id')");

                if (ArrayOptFirstElem(arrGroupColls) != undefined) {
                    // infologger("1.10 group found, getting collaborators");
                    //arrCollIds = ArrayExtract( arrGroupColls, "collaborator_id" );
                    //arrCollaboratorPack = QueryCatalogByKeys("collaborators", "id", arrCollIds);
                    arrCollaboratorPack = XQuery("for $elem in collaborators where MatchSome($elem/id, (" + ArrayMerge(arrGroupColls, "This.collaborator_id.Value", ",") + ")) return $elem/Fields('id'," + sXQFileldList + ")");
                }

            }
        }

        // infologger("2. Building filter conditions");

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
                    if (sFilterData != null) {
                        infologger("r sFilterData: " + sFilterData);
                        /*xarrRegionOrgs = XQuery("for $elem in orgs where doc-contains($elem/id,'wt_data','[report_region_id=" + sFilterData + "~string]') return $elem");
                        if (ArrayOptFirstElem(xarrRegionOrgs) != undefined)
                        {
                            arrRegionOrgIds = ArrayExtract(xarrRegionOrgs, "This.id");
                            aXQueryAdd.push("MatchSome( $elem/org_id, ( " + ArrayMerge( arrRegionOrgIds, "This", "," ) + " ))");
                        }*/
                    }
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
            // infologger("3. Filter set: " + _i);

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
                }
                else if (arrFilteredHumans[_i].PrimaryKey > arrCollaboratorPack[_j].PrimaryKey)
                    _j++;
                else
                    _i++;

                if (cut > 0 && _j > cut) // Cut array to not exceed cut
                    break;
            }

        }
        else {
            // infologger("3. No filter set");

            if (cut > 0)
                arrCollaboratorPack = ArrayRange(arrCollaboratorPack, 0, cut); /* Cut array to not exceed cut */
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
        // infologger("4. Humans combed");

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

        // infologger("5. Resultset formed");

        tools_web.set_user_data("boss_panel_collaborators_cache_for_reports" + curUserID, ({ "result_array": xarrResult }), 86400);

        // infologger("6. Session data refreshed");
    }