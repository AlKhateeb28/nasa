// const_start
// 6791147095600873162
var sConstEventName = tools_web.get_web_const('c_event', curLngWeb);
// const_end

sList = (listParam != '' ? listParam : 'лист присутствия');
sAOC = (AOCParam != '' ? AOCParam : 'АОС');
// alert('sAOC' + sAOC);
// alert('sList' + sList);

function GetDirectSubPersonIds(iUserId) {
    arrCollaborators = new Array();
    arrPositions = XQuery("for $elem in positions where $elem/is_boss=true() and $elem/basic_collaborator_id = " + iUserId + " return $elem");
    arrSubdivisionIds = ArrayExtract(XQuery("for $elem in func_managers where $elem/person_id = " + iUserId + " and $elem/catalog = 'subdivision' return $elem"), "object_id");
    arrCollaborators = ArrayExtract(XQuery("for $elem in positions where MatchSome( $elem/parent_object_id, (" + ArrayMerge(arrSubdivisionIds, "This", ",") + ")) and $elem/basic_collaborator_id != " + iUserId + " return $elem"), "basic_collaborator_id");
    arrOrgIds = ArrayExtract(XQuery("for $elem in func_managers where $elem/person_id = " + iUserId + " and $elem/catalog = 'org' return $elem"), "object_id");
    arrCollaborators = ArrayUnion(ArrayExtract(XQuery("for $elem in positions where MatchSome( $elem/org_id, (" + ArrayMerge(arrOrgIds, "This", ",") + ")) and $elem/parent_object_id = null() and $elem/basic_collaborator_id != " + iUserId + " return $elem"), "basic_collaborator_id"), arrCollaborators);
    arrCollaborators = ArrayUnion(ArrayExtract(XQuery("for $elem in func_managers where $elem/person_id = " + iUserId + " and $elem/catalog = 'collaborator' return $elem"), "object_id"), arrCollaborators);
    return arrCollaborators;
}

function get_date(dDate, bIn, catTimezone) {
    return dDate
}

try {
    arrEventTypes = String(sTypes).split(',');
    arrEventStatuses = String(sStatuses).split(';');
    iSelectedLector = OptInt(iSelectedLector, null)
    iSelectedPlace = OptInt(iSelectedPlace, null)
    iSelectedEducationOrg = OptInt(iSelectedEducationOrg, null)
    if (sSelectedType == "all")
        sSelectedType = "participant;lector;tutor"

    arrEvents = new Array();

    // Добавка к запросу для фильтрации по дате
    if (end != "")
        end = DateNewTime(Date(end), 23, 59, 59);
    sDateQueryAdd = "";
    if (sSelectedView == "calendar" && start != "" && end != "") {
        start = get_date(start, true);
        end = get_date(end, true);
        sDateQueryAdd += " and (($elem/finish_date > date('" + start + "') and $elem/start_date < date('" + end + "') ) or ($elem/finish_date = null() and $elem/start_date > date('" + start + "') ) )";
    }
    iSelectedYear = OptInt(iSelectedYear, 0)
    iSelectedMonth = OptInt(iSelectedMonth, 0)
    if (sSelectedView != "calendar" && iSelectedYear != 0) {
        if (iSelectedMonth != 0) {
            dStartDate = Date("01." + StrInt(iSelectedMonth, 2) + "." + iSelectedYear);
            dFinishDate = null;
            if (iSelectedMonth != 12) {
                dFinishDate = DateOffset(Date("01." + StrInt(iSelectedMonth + 1, 2) + "." + iSelectedYear), 0 - 1);
            }
            else {
                dFinishDate = DateOffset(Date("01.01." + (iSelectedYear + 1)), 0 - 1);
            }
        }
        else {
            dStartDate = Date("01.01." + iSelectedYear);
            dFinishDate = Date("31.12." + iSelectedYear);
        }
        dStartDate = get_date(dStartDate, true);
        dFinishDate = get_date(dFinishDate, true);
        sDateQueryAdd += " and ($elem/finish_date > date('" + dStartDate + "') and $elem/start_date < date('" + dFinishDate + "') )";
    }

    // Добавка к запросу для фильтрации по типу
    sTypeQueryAdd = "";

    for (sEventTypeElem in arrEventTypes) {
        sEventType = Trim(sEventTypeElem);
        if (sEventType != "") {
            if (sTypeQueryAdd != "")
                sTypeQueryAdd += " or ";
            sTypeQueryAdd += " $elem/type_id='" + sEventType + "'";
        }
    }
    if (sTypeQueryAdd != "")
        sTypeQueryAdd = " and (" + sTypeQueryAdd + ")";

    // Добавка к запросу для фильтрации по статусу
    sStatusQueryAdd = "";
    /*
    // Если пользователь смотрит свои мероприятия и является преподавателем или ответственным, он должен всегда видеть мероприятия с типом "Проект"
    if(StrLowerCase(sSelectedTab) == "my" && ( StrContains( sSelectedType, "tutor" ) || StrContains( sSelectedType, "lector" ) ) && ArrayOptFind(arrEventTypes,"This=='project'") == undefined)
    {
        arrEventStatuses.push("project");
    }
    */

    arrEventStatuses.push("project");

    if (sSelectedStatus == "all") {
        for (sStatus in arrEventStatuses) {
            if (sStatus != "") {
                if (sStatusQueryAdd != "")
                    sStatusQueryAdd += " or ";
                sStatusQueryAdd += (" $elem/status_id='" + sStatus + "'");
            }
        }
        if (sStatusQueryAdd != "")
            sStatusQueryAdd = " and (" + sStatusQueryAdd + ")";
    }
    else {
        sStatusQueryAdd = " and $elem/status_id='" + sSelectedStatus + "'";
    }

    arrEvents = new Array();
    switch (StrLowerCase(sSelectedTab)) {
        case "all_dow_doc":
            // Находим все публичные
            sQuery = "for $elem in events where 1 = 1 ";
            sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
            sQuery += " return $elem";

            arrEvents = XQuery(sQuery);
            //alert('count arrEvents: ' + ArrayCount(arrEvents));
            //alert(sQuery)

            //извлекаем данные по идентификаторам и выбираем уникальные
            arrEvents = ArrayExtract(arrEvents, "id");
            break;
        case "my":
            if (sSelectedType == "")
                break;

            for (catSelectedType in String(sSelectedType).split(";"))
                switch (catSelectedType) {
                    case "participant":
                        sQuery = "for $elem in event_collaborators where $elem/collaborator_id = " + curUserID + " and $elem/is_collaborator=true()";
                        sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                        sQuery += " return $elem";
                        arrTmpEvents = XQuery(sQuery);
                        arrTmpEvents = ArraySelectDistinct(arrTmpEvents, 'event_id');
                        arrEvents = ArrayUnion(arrEvents, ArrayExtract(arrTmpEvents, "event_id"));
                        break;

                    case "lector":
                        arrLectors = XQuery('for $elem in lectors where $elem/person_id = ' + curUserID + ' and $elem/is_dismiss != true() return $elem');
                        for (_lector in arrLectors) {
                            sQuery = "for $elem in event_lectors where $elem/lector_id = " + _lector.id;
                            sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                            sQuery += " return $elem";
                            arrEvents = ArrayUnion(arrEvents, ArrayExtract(XQuery(sQuery), "event_id"));
                        }
                        //arrEvents = ArrayExtract(arrEvents, "event_id");
                        break

                    case "tutor":
                        sQuery = "for $elem in event_collaborators where $elem/collaborator_id = " + curUserID + " and ($elem/is_tutor=true() or $elem/is_preparation=true()) ";
                        sQuery += sDateQueryAdd + sTypeQueryAdd + sStatusQueryAdd;
                        sQuery += " return $elem";

                        arrTmpEvents = XQuery(sQuery);
                        arrTmpEvents = ArraySelectDistinct(arrTmpEvents, "event_id");
                        arrEvents = ArrayUnion(arrEvents, ArrayExtract(arrTmpEvents, "event_id"));
                        break;

                }
            break;
        case "mysub":
            if (sSelectedSubType == "direct")
                arrCollaborators = tools.get_direct_sub_person_ids(curUserID);
            else
                arrCollaborators = tools.get_sub_person_ids_by_func_manager_id(curUserID);
            //arrCollaborators = ArrayExtract(arrCollaborators, "PrimaryKey");
            //arrCollaborators = new Array();
            if (ArrayOptFirstElem(arrCollaborators) != undefined) {

                if (sDateQueryAdd != "")
                    arrEvents = XQuery("for $elem in event_collaborators where MatchSome( $elem/collaborator_id, (" + ArrayMerge(arrCollaborators, "PrimaryKey", ",") + "))" + sDateQueryAdd + " return $elem");
                //arrEvents = XQuery("for $elem in event_collaborators where $elem/start_date > date('" + Date(start) + "') and $elem/start_date < date('" + Date(end) + "') and MatchSome( $elem/collaborator_id, (" + ArrayMerge(arrCollaborators,"PrimaryKey",",") + ")) return $elem");
                else
                    arrEvents = QueryCatalogByKeys("event_collaborators", "collaborator_id", arrCollaborators);
                if (sSelectedView == "calendar") {
                    arrEvents = ArraySelect(arrEvents, "DateNewTime(start_date)>=Date(start)&&DateNewTime(start_date)<=Date(end)");
                }

                sTypeQueryAdd = "";
                for (sEventType in arrEventTypes) {
                    if (sEventType != "") {
                        if (sTypeQueryAdd != "")
                            sTypeQueryAdd += " || ";
                        sTypeQueryAdd += " type_id=='" + sEventType + "'";
                    }
                }
                if (sTypeQueryAdd != "")
                    arrEvents = ArraySelect(arrEvents, sTypeQueryAdd);

                sStatusQueryAdd = "";
                if (sSelectedStatus == "all") {
                    for (sStatus in arrEventStatuses) {
                        if (sStatus != "") {
                            if (sStatusQueryAdd != "")
                                sStatusQueryAdd += " || ";
                            sStatusQueryAdd += (" status_id=='" + sStatus + "'");
                        }
                    }
                }
                else {
                    sStatusQueryAdd = "status_id=='" + sSelectedStatus + "'";
                }
                if (sStatusQueryAdd != "") {
                    arrEvents = ArraySelect(arrEvents, sStatusQueryAdd);
                }
                arrEvents = ArraySelectDistinct(arrEvents, "event_id");
                arrEvents = ArrayExtract(arrEvents, "event_id");
            }
            break;
    }

    sEventsQuery = "for $elem in events where MatchSome($elem/id, (" + ArrayMerge(arrEvents, "This", ",") + ")) ";
    if (sSearchWord != "")
        sEventsQuery += " and doc-contains($elem/id,'" + DefaultDb + "'," + XQueryLiteral(sSearchWord) + ")";
    sEventsQuery += " return $elem";

    arrEvents = XQuery(sEventsQuery);
    //alert('sEventsQuery: ' + sEventsQuery);
    //Если указано расположение, отбираем по нему	

    xarrUserPlacesIds = new Array();
    if (bShowOnlySamePlace) // Показ только мероприятий, совпадающих по расположению с подразделением участника
    {

        if (curUser.position_parent_id.HasValue && curUser.position_parent_id.ForeignElem != undefined) {
            iParentId = curUser.position_parent_id;
            do {
                teSub = OpenDoc(UrlFromDocID(iParentId)).TopElem;
                if (teSub.place_id.HasValue) {
                    xarrUserPlacesIds.push(teSub.place_id);
                }
                iParentId = teSub.parent_object_id;
            }
            while (teSub.parent_object_id.HasValue && teSub.parent_object_id.OptForeignElem != undefined)
        }
    }

    if (iSelectedPlace != 0 && iSelectedPlace != null) {
        xarrPlacesIds = new Array();
        xarrPlacesIds.push(iSelectedPlace);
        if (bShowOnlySamePlace)
            xarrPlacesIds = ArrayIntersect(xarrPlacesIds, xarrUserPlacesIds, "This", "This")
    }
    else
        xarrPlacesIds = xarrUserPlacesIds;

    //Если указана обучающая организация, отбираем по ней
    if (iSelectedEducationOrg != 0 && iSelectedEducationOrg != null)
        arrEvents = ArraySelect(arrEvents, "This.education_org_id.HasValue && This.education_org_id == " + iSelectedEducationOrg);

    //Если указано расположение, отбираем по нему
    if ((iSelectedPlace != 0 && iSelectedPlace != null) || bShowOnlySamePlace)
        arrEvents = ArraySelect(arrEvents, "This.place_id.HasValue && ArrayOptFind(xarrPlacesIds, 'This == ' + This.place_id) != undefined");

    //Если указана организационная форма, отбираем по ней
    if (sSelectedOrgForm != "all")
        arrEvents = ArraySelect(arrEvents, "This.organizational_form.HasValue && This.organizational_form == '" + sSelectedOrgForm + "'");

    //Если указана форма проведения, отбираем по ней
    if (sSelectedEventForm != "all")
        arrEvents = ArraySelect(arrEvents, "This.event_form.HasValue && This.event_form == '" + sSelectedEventForm + "'");

    //Если указана учебная программа - отбираем по ней
    if (iSelectedEducationMethod != 0 && iSelectedEducationMethod != null)
        arrEvents = ArraySelect(arrEvents, "This.education_method_id.HasValue && This.education_method_id == " + iSelectedEducationMethod);

    if (iSelectedLector != 0 && iSelectedLector != null) {
        xarrLectorEventsIds = ArrayExtract(XQuery("for $elem in event_lectors where $elem/lector_id = " + iSelectedLector + " return $elem"), "event_id");
        arrEvents = ArraySelect(arrEvents, "ArrayOptFind(xarrLectorEventsIds, 'This == ' + This.id) != undefined");
    }

    if (global_settings.settings.check_access_on_lists) {
        arrEvents = ArraySelect(arrEvents, "tools_web.check_access( This.id, curUserID, curUser, Request.Session )");
    }

    userRoleCod = curUser.access.access_role;

    arrEventsNew = new Array();

    if (userRoleCod == "trainerRCK") {

        if (curUser.position_parent_id != null) {
            userPosParent = curUser.position_parent_id.OptForeignElem;

            if (userPosParent != undefined) {
                userRegId = userPosParent.region_id;

                for (event in arrEvents) {
                    eventDocTE = tools.open_doc(event.id).TopElem;

                    if (eventDocTE.education_org_type == 'id') {
                        docEducationOrg = tools.open_doc(OptInt(eventDocTE.education_org_id, 0));

                        if (docEducationOrg != undefined) {
                            customElem = ArrayOptFind(docEducationOrg.TopElem.custom_elems, "This.name == 'FCK_region'");

                            if (customElem != undefined) {

                                if (OptInt(customElem.value, 0) == OptInt(userRegId, 0)) {
                                    arrEventsNew.push(event);
                                }
                            }
                        }
                    } else {
                        catEducatOrg = ArrayOptFirstElem(tools.xquery('for $elem in education_orgs where $elem/name = "' + eventDocTE.education_org_name + '" return $elem'));
                        if (catEducatOrg != undefined) {
                            docEducationOrg = tools.open_doc(catEducatOrg.id, 0);

                            if (docEducationOrg != undefined) {
                                customElem = ArrayOptFind(docEducationOrg.TopElem.custom_elems, "This.name == 'FCK_region'");

                                if (customElem != undefined) {

                                    if (OptInt(customElem.value, 0) == OptInt(userRegId, 0)) {
                                        arrEventsNew.push(event);
                                    }
                                }
                            }
                        };
                    }
                }
            }
        } else if (curUser.org_id != null) {
            userOrg = curUser.org_id.OptForeignElem;

            if (userOrg != undefined) {
                userRegId = userOrg.region_id;

                for (event in arrEvents) {
                    eventDocTE = tools.open_doc(event.id).TopElem;

                    if (eventDocTE.education_org_type == 'id') {
                        docEducationOrg = tools.open_doc(OptInt(eventDocTE.education_org_id, 0));

                        if (docEducationOrg != undefined) {
                            customElem = ArrayOptFind(docEducationOrg.TopElem.custom_elems, "This.name == 'FCK_region'");

                            if (customElem != undefined) {

                                if (OptInt(customElem.value, 0) == OptInt(userRegId, 0)) {
                                    arrEventsNew.push(event);
                                }
                            }
                        }
                    } else {
                        catEducatOrg = ArrayOptFirstElem(tools.xquery('for $elem in education_orgs where $elem/name = "' + eventDocTE.education_org_name + '" return $elem'));
                        if (catEducatOrg != undefined) {
                            docEducationOrg = tools.open_doc(catEducatOrg.id, 0);

                            if (docEducationOrg != undefined) {
                                customElem = ArrayOptFind(docEducationOrg.TopElem.custom_elems, "This.name == 'FCK_region'");

                                if (customElem != undefined) {

                                    if (OptInt(customElem.value, 0) == OptInt(userRegId, 0)) {
                                        arrEventsNew.push(event);
                                    }
                                }
                            }
                        };
                    }
                }
            }
        }
        arrEvents = arrEventsNew;
    }


    sEventsId = [];
    iCountId = 0;

    //alert('arrEvents: ' + tools.object_to_text(arrEvents, 'json'));
    //alert('count arrEvents:' + ArrayCount(arrEvents));

    for (event in arrEvents) {
        eventDocTE = tools.open_doc(event.id).TopElem;
        if (iSelectedResponsible != 0 && iSelectedResponsible != null) {
            if (ArrayOptFind(eventDocTE.even_preparations, "This.person_id == iSelectedResponsible") != undefined) {
                for (file in eventDocTE.files) {
                    if ((iSelectedDocumentType == "all" && (StrContains(file.file_id.OptForeignElem.name, sList, true) || StrContains(file.file_id.OptForeignElem.name, sAOC, true))) || (iSelectedDocumentType == "list_pris" && StrContains(file.file_id.OptForeignElem.name, sList, true)) || (iSelectedDocumentType == "AOC" && StrContains(file.file_id.OptForeignElem.name, sAOC, true))) {
                        sEventsId.push(file.file_id);
                        iCountId++;
                    }
                }
            }
        } else {
            for (file in eventDocTE.files) {

                if ((iSelectedDocumentType == "all" && (StrContains(file.file_id.OptForeignElem.name, sList, true) || StrContains(file.file_id.OptForeignElem.name, sAOC, true))) || (iSelectedDocumentType == "list_pris" && StrContains(file.file_id.OptForeignElem.name, sList, true)) || (iSelectedDocumentType == "AOC" && StrContains(file.file_id.OptForeignElem.name, sAOC, true))) {
                    sEventsId.push(file.file_id);
                    iCountId++;
                }
                //alert('file.file_id.OptForeignElem.name: ' + file.file_id.OptForeignElem.name);
            }
        }
    }

    if (ArrayOptFirstElem(sEventsId) != undefined) {
        //MESSAGE = "Найдено файлов: " + iCountId;
        MESSAGE = "Формирование архива запущено. Подробную информацию можно узнать в логах сервера.";
        tools.start_agent(6791563917013755061, null, ArrayMerge(sEventsId, 'This', ';'), null, null);
    } else {
        MESSAGE = "Не найдено ни одного подходящего файла";
    }
}
catch (x) {
    //alert("Ошибка при формировании архива с материалами мероприятия")
    alert(x);
    RESULT = new Array();
    ERROR = 1;
}