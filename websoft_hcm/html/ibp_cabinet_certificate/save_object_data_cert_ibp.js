// 6971547756809832147
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

function createCertificate (_MyDate, _curDoc, i, programName) {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT cs.org_id " +
        " FROM [WTDB].[dbo].collaborators cs" +
        " WHERE cs.id = " + _curDoc.TopElem.object_id));

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Coll.ID: " + _curDoc.TopElem.object_id);

    if(ArrayCount(dataList) > 0) {
        orgDoc = tools.open_doc(dataList[0].org_id);

        if(orgDoc != undefined) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Org.ID: " + orgDoc.DocID);

            docCertificate = tools.create_certificate_to_person(object_id, certificate_type_id);
            docCertificate.TopElem.serial = "И";
            docCertificate.TopElem.delivery_date = _MyDate;
            docCertificate.TopElem.custom_elems.ObtainChildByKey("programm_name").value = programName;
            docCertificate.TopElem.custom_elems.ObtainChildByKey("object_data").value = _curDoc.DocID;
            docCertificate.TopElem.custom_elems.ObtainChildByKey("org_name").value = orgDoc.TopElem.name;

            docCertificate.Save();

            _curDoc.TopElem.custom_elems.ObtainChildByKey("certificate_" + i).value = docCertificate.DocID;
            _curDoc.Save();
            tools.create_notification("cert_ibp_print", object_id, programName, docCertificate.DocID);

            addLogMessage(loggerName, "[agent.id: " + agentId + "] Certificate created. ID: " + docCertificate.DocID);

            return docCertificate.DocID;
        } else {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with ID " + dataList[0].org_id + " is not exist");

            showException("Организация не найдена");
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Collaborator with ID " + _curDoc.TopElem.object_id + " is not exist");

        showException("Сотрудник не найден");
    }
}

function hasSpecialPrivileges(userId) {
    groupId = 7180977708493279992;

    groupDoc = tools.open_doc(groupId);

    if(groupDoc != undefined) {
        if(groupDoc.TopElem.collaborators.GetOptChildByKey(userId) != undefined) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] User with ID " + userId + " has special privileges!");

            return true;
        }
    } else {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Group with ID " + groupId + " is not exist!");
    }

    return false;
}

function validateAllowableDateInterval(type, personId, incomingDate, prefix, programName) {
    if(incomingDate != undefined) {
        if(type == 0) {
            currentDate = Date();

            addLogMessage(loggerName, "[agent.id: " + agentId + "] IncDate: " + incomingDate + " CurDate: " + currentDate);

            if (Month(incomingDate) != Month(currentDate) || Year(incomingDate) != Year(currentDate)) {
                showException(prefix + programName + " за пределами текущего месяца!");
            }
        } else {
            dataList = ArrayDirect(XQuery("sql: " +
                " SELECT eps.id, " +
                "       eps.object_id " +
                " FROM [WTDB].[dbo].education_plans eps " +
                "    INNER JOIN [WTDB].[dbo].education_plan ep ON eps.id = ep.id " +
                " WHERE eps.code LIKE 'ModProg_FCK%'"));

            start = null;

            for (data in dataList) {
                eduPlanDoc = tools.open_doc(data.id);

                if (eduPlanDoc != undefined) {
                    eduPlanDocTE = eduPlanDoc.TopElem;

                    if (hasGroupPerson(OptInt(data.object_id), OptInt(personId))) {
                        for (program in eduPlanDoc.TopElem.programs) {
                            if (StrUpperCase(program.name) == "СЕРТИФИКАЦИЯ") {
                                if (program.finish_date != '') {
                                    if (start == null) {
                                        start = Date(program.finish_date);

                                        break;
                                    }

                                    if (Date(program.finish_date) > start) {
                                        start = Date(program.finish_date);

                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (start != null) {
                if(!hasSpecialPrivileges(curUserID)) {
                    last = DateOffset(start, 50 * 86400);
                    start = DateOffset(start, -42 * 86400);

                    if (incomingDate < start || incomingDate > last) {
                        showException("Не сохранено. Сертификация возможна с " + StrDate(start, false, false) + " по " + StrDate(last, false, false) + " !");
                    }
                }
            } else {
                showException("Не сохранено. Сотрудник не участвовал в программе подготовки!");
            }
        }
    }
}

function checkAccessDate(objectDataDoc, checkBox, accessDate, programName) {
    incomingDate = OptDate(accessDate);

    if (checkBox == "1" && OptDate(incomingDate) == undefined) {
        showException("Заполните Дату допуска к сертификации");
    }

    if(objectDataDoc == null || !objectDataDoc.TopElem.custom_elems.ObtainChildByKey("flag").value) {
        validateAllowableDateInterval(0, null, incomingDate, "", programName);
    }
}

function check_date(personId, position, _MyCombo, _MyDate, programName) {
    incomingDate = OptDate(_MyDate);

    if (_MyCombo == "Сертифицировать" && incomingDate == undefined) {
        //_MyDateObj.Class = "datepicker-error-color";
        showException("Заполните Дату в " + programName + "!");
    }

    if(StrUpperCase(_MyCombo) == "СЕРТИФИЦИРОВАТЬ") {
        validateAllowableDateInterval(1, personId, incomingDate, "Выбранная дата в ", programName);
    }
}

function showException(errorMessage) {
    ERROR = 1;
    MESSAGE = errorMessage;
    Cancel();
}

function check_combo(_MyCombo, _MyDate, _curDoc, i, programName) {
    addToDossier = false;

    certificateDocId = null;

    if (_MyCombo == "Сертифицировать" && _curDoc.TopElem.custom_elems.ObtainChildByKey("certificate_" + i).value == '') {
        programName = String(programName);
        programName = StrContains(programName, "«") && StrContains(programName, "»") ? StrRangePos(programName, programName.indexOf("«")+2, programName.indexOf("»")) : programName;
        certificateDocId = createCertificate(_MyDate, _curDoc, i, programName);

        if(certificateDocId != null) {
            addToDossier = true;
        }
    } else if(_MyCombo == "Не сертифицировать") {
        addToDossier = true;
    }

    if(addToDossier) {
        addCertificateDataToDossier(certificateDocId, _curDoc.TopElem.object_id, _MyCombo, i, _MyDate)
    }
}

function addCertificateDataToDossier(certificateDocId, personId, result, officeOrder, deliveryDate) {
    dossierDoc = null;
    dossierDocTE = null;

    eduMethodList = ArrayDirect(XQuery("sql: " +
        " SELECT ems.id, " +
        "       ems.name, " +
        "       em.data.value('(//custom_elems/custom_elem[name=''vn_tren_code'']/value)[1]', 'varchar(max)') AS code, " +
        "       ems.office_order " +
        " FROM [WTDB].[dbo].education_methods ems " +
        "         INNER JOIN [WTDB].[dbo].education_method em ON ems.id = em.id " +
        " WHERE ems.code = 'cert_vn_tren_base' " +
        "    AND ems.office_order = " + officeOrder));

    if(ArrayCount(eduMethodList) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Education method with office_order " + officeOrder + " is not exist!");

        showException("Не найдена обучающая программа");

        return;
    }

    personDossiers = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s " +
        " WHERE trainer_id = " + personId));

    if(ArrayCount(personDossiers) == 0) {
        addLogMessage(loggerName, "[agent.id: " + agentId + "] Dossier with ID " + personDossiers[0].id + " is not exist!");

        showException("Не найдено существующее досье по ID");

        return;
    }

    dossierDoc = tools.open_doc(personDossiers[0].id);
    dossierDocTE = dossierDoc.TopElem;

    programId = eduMethodList[0].id;
    code = eduMethodList[0].code;

    eval("dossierDocTE." + code + " = " + programId);
    eval("dossierDocTE." + code + "_result = '" + getNormalizedResult(result) + "'");
    certificateYear = "";
    if (deliveryDate != null && deliveryDate != undefined && deliveryDate != "") {
        eval("dossierDocTE." + code + "_cert_date = Date('" + deliveryDate + "')");
        certificateYear = StrDate(Date(deliveryDate), false, false).split(".")[2];
    }

    if(certificateDocId != null) {
        certificateDoc = tools.open_doc(certificateDocId)
        certificateDocTE = certificateDoc.TopElem;

        certificateNumber = certificateDocTE.serial + "-" + certificateDocTE.number + "/" + certificateYear;

        eval("dossierDocTE." + code + "_cert_id = " + certificateDocId);
        eval("dossierDocTE." + code + "_cert = '" + certificateNumber + "'");
    }

    dossierDoc.Save();
}

function createDossier(personId, isSelection, selectionDate) {
    personDossiers = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].cc_dossier_vntren_2025s " +
        " WHERE trainer_id = " + personId));

    if(ArrayCount(personDossiers) == 0 && isSelection == "1") {
        personData = ArrayDirect(XQuery("sql: " +
            " SELECT ps.name AS position_name, " +
            "       os.code AS inn, " +
            "       os.name AS org_name, " +
            "       rs.name AS region_name, " +
            "       rep_rs.name AS report_region_name, " +
            "       cs.email, " +
            "       cs.fullname, " +
            "       cs.phone " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "    INNER JOIN [WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            "    INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "    INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
            "    INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
            "    LEFT JOIN [WTDB].[dbo].regions AS rep_rs ON o.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'bigint') = rep_rs.id " +
            " WHERE cs.id = " + personId));

        if(ArrayCount(personData) == 0) {
            addLogMessage(loggerName, "[agent.id: " + agentId + "] Person with ID " + personId + " is not exist!");

            return false;
        }

        dossierDoc = tools.new_doc_by_name( "cc_dossier_vntren_2025", false )
        dossierDoc.BindToDb(DefaultDb);

        dossierDocTE = dossierDoc.TopElem;

        dossierDocTE.trainer_id = personId;
        dossierDocTE.position_trainer = personData[0].position_name;
        dossierDocTE.organization_inn = personData[0].inn;
        dossierDocTE.organization_name = personData[0].org_name;
        dossierDocTE.region_organization = personData[0].region_name;
        dossierDocTE.region_in_reporting = personData[0].report_region_name;
        dossierDocTE.trainer_fullname = personData[0].fullname;
        dossierDocTE.email = personData[0].email;
        dossierDocTE.phone = personData[0].phone;
        dossierDocTE.trainer_type = "ИБП";
        dossierDocTE.finish_date = selectionDate;
        dossierDocTE.fact_trained = "да";

        dossierDoc.Save();
    }

    return true;
}

function getNormalizedResult(result) {
    if(result == "Сертифицировать") {
        return "сертифицирован";
    } else if(result == "Не сертифицировать") {
        return "не сертифицирован";
    } else {
        return  "";
    }
}

function hasGroupPerson(groupId, personId) {
    groupDoc = tools.open_doc(groupId);

    if(groupDoc == undefined) {
        return false;
    }

    for(person in groupDoc.TopElem.collaborators) {
        if(OptInt(person.collaborator_id) == OptInt(personId)) {
            return true;
        }
    }

    return false;
}

var agentId = 6971547756809832147;
var loggerName = "agent_6971547756809832147";

addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

/*if (checkbox1 == "") {
    showException("Не сохранено. Сотрудник не допущен к сертификации");
}*/

var certificate_type_id = 7156641934046394931; // Подготовка инструкторов по БП
var cert_object_data_type_id = 6966499755925068211; // Сертификация инструкторов по БП
object_id = OptInt(object_id);

//sXQ = "for $elem in object_datas where $elem/object_data_type_id=" + cert_object_data_type_id + " and $elem/object_id=" + object_id + " and $elem/sec_object_id=" + curUserID + " return $elem"
sXQ = "for $elem in object_datas where $elem/object_data_type_id=" + cert_object_data_type_id + " and $elem/object_id=" + object_id + " return $elem";

foundObjectData = ArrayOptFirstElem(XQuery(sXQ));

if (foundObjectData == undefined) {
    checkAccessDate(null, checkbox1, MyDateAccess, "Дата допуска к сертификации ");
    check_date(object_id, 1, MyCombo1, MyDate1, custom_templates.object_data_type.items[0].sheets[1].title);
    check_date(object_id, 2, MyCombo2, MyDate2, custom_templates.object_data_type.items[0].sheets[2].title);
    check_date(object_id, 3, MyCombo3, MyDate3, custom_templates.object_data_type.items[0].sheets[3].title);
    check_date(object_id, 4, MyCombo4, MyDate4, custom_templates.object_data_type.items[0].sheets[4].title);
    check_date(object_id, 5, MyCombo5, MyDate5, custom_templates.object_data_type.items[0].sheets[5].title);
    check_date(object_id, 6, MyCombo6, MyDate6, custom_templates.object_data_type.items[0].sheets[6].title);

    newDoc = tools.new_doc_by_name('object_data', false);
    newDoc.BindToDb();

    teNewDoc = newDoc.TopElem;
    teNewDoc.object_data_type_id = cert_object_data_type_id;
    teNewDoc.object_type = "collaborator";
    teNewDoc.object_id = object_id;
    foundCol = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/id="+object_id+" return $elem"));
    teNewDoc.object_name = foundCol == undefined ? '' : foundCol.fullname;
    teNewDoc.sec_object_type = "collaborator";
    teNewDoc.sec_object_id = curUserID;
    teNewDoc.custom_elems.ObtainChildByKey("flag").value = checkbox1;
    if (checkbox1 == "1") {
        teNewDoc.custom_elems.ObtainChildByKey("date_access").value = MyDateAccess;
    }
    teNewDoc.custom_elems.ObtainChildByKey("result_1").value = MyCombo1;
    teNewDoc.custom_elems.ObtainChildByKey("result_2").value = MyCombo2;
    teNewDoc.custom_elems.ObtainChildByKey("result_3").value = MyCombo3;
    teNewDoc.custom_elems.ObtainChildByKey("result_4").value = MyCombo4;
    teNewDoc.custom_elems.ObtainChildByKey("result_5").value = MyCombo5;
    teNewDoc.custom_elems.ObtainChildByKey("result_6").value = MyCombo6;
    teNewDoc.custom_elems.ObtainChildByKey("date_1").value = MyDate1;
    teNewDoc.custom_elems.ObtainChildByKey("date_2").value = MyDate2;
    teNewDoc.custom_elems.ObtainChildByKey("date_3").value = MyDate3;
    teNewDoc.custom_elems.ObtainChildByKey("date_4").value = MyDate4;
    teNewDoc.custom_elems.ObtainChildByKey("date_5").value = MyDate5;
    teNewDoc.custom_elems.ObtainChildByKey("date_6").value = MyDate6;
    teNewDoc.custom_elems.ObtainChildByKey("comment_1").value = Edit1;
    teNewDoc.custom_elems.ObtainChildByKey("comment_2").value = Edit2;
    teNewDoc.custom_elems.ObtainChildByKey("comment_3").value = Edit3;
    teNewDoc.custom_elems.ObtainChildByKey("comment_4").value = Edit4;
    teNewDoc.custom_elems.ObtainChildByKey("comment_5").value = Edit5;
    teNewDoc.custom_elems.ObtainChildByKey("comment_6").value = Edit6;
    teNewDoc.custom_elems.ObtainChildByKey("task_1").value = MyCombo_task1;
    teNewDoc.custom_elems.ObtainChildByKey("task_2").value = MyCombo_task2;
    teNewDoc.custom_elems.ObtainChildByKey("task_3").value = MyCombo_task3;
    teNewDoc.custom_elems.ObtainChildByKey("task_comm_1").value = Edit_task1;
    teNewDoc.custom_elems.ObtainChildByKey("task_comm_2").value = Edit_task2;
    teNewDoc.custom_elems.ObtainChildByKey("task_comm_3").value = Edit_task3;

    newDoc.Save();
    curDoc = newDoc;
} else {
    myDoc = tools.open_doc(foundObjectData.id);

    checkAccessDate(myDoc, checkbox1, MyDateAccess, "Дата допуска к сертификации ");
    check_date(object_id, 1, MyCombo1, MyDate1, custom_templates.object_data_type.items[0].sheets[1].title);
    check_date(object_id, 2, MyCombo2, MyDate2, custom_templates.object_data_type.items[0].sheets[2].title);
    check_date(object_id, 3, MyCombo3, MyDate3, custom_templates.object_data_type.items[0].sheets[3].title);
    check_date(object_id, 4, MyCombo4, MyDate4, custom_templates.object_data_type.items[0].sheets[4].title);
    check_date(object_id, 5, MyCombo5, MyDate5, custom_templates.object_data_type.items[0].sheets[5].title);
    check_date(object_id, 6, MyCombo6, MyDate6, custom_templates.object_data_type.items[0].sheets[6].title);

    teMyDoc = myDoc.TopElem;
    teMyDoc.custom_elems.ObtainChildByKey("flag").value = checkbox1;
    teMyDoc.custom_elems.ObtainChildByKey("date_access").value = MyDateAccess;
    teMyDoc.custom_elems.ObtainChildByKey("result_1").value = MyCombo1;
    teMyDoc.custom_elems.ObtainChildByKey("result_2").value = MyCombo2;
    teMyDoc.custom_elems.ObtainChildByKey("result_3").value = MyCombo3;
    teMyDoc.custom_elems.ObtainChildByKey("result_4").value = MyCombo4;
    teMyDoc.custom_elems.ObtainChildByKey("result_5").value = MyCombo5;
    teMyDoc.custom_elems.ObtainChildByKey("result_6").value = MyCombo6;
    teMyDoc.custom_elems.ObtainChildByKey("date_1").value = MyDate1;
    teMyDoc.custom_elems.ObtainChildByKey("date_2").value = MyDate2;
    teMyDoc.custom_elems.ObtainChildByKey("date_3").value = MyDate3;
    teMyDoc.custom_elems.ObtainChildByKey("date_4").value = MyDate4;
    teMyDoc.custom_elems.ObtainChildByKey("date_5").value = MyDate5;
    teMyDoc.custom_elems.ObtainChildByKey("date_6").value = MyDate6;
    teMyDoc.custom_elems.ObtainChildByKey("comment_1").value = Edit1;
    teMyDoc.custom_elems.ObtainChildByKey("comment_2").value = Edit2;
    teMyDoc.custom_elems.ObtainChildByKey("comment_3").value = Edit3;
    teMyDoc.custom_elems.ObtainChildByKey("comment_4").value = Edit4;
    teMyDoc.custom_elems.ObtainChildByKey("comment_5").value = Edit5;
    teMyDoc.custom_elems.ObtainChildByKey("comment_6").value = Edit6;
    teMyDoc.custom_elems.ObtainChildByKey("task_1").value = MyCombo_task1;
    teMyDoc.custom_elems.ObtainChildByKey("task_2").value = MyCombo_task2;
    teMyDoc.custom_elems.ObtainChildByKey("task_3").value = MyCombo_task3;
    teMyDoc.custom_elems.ObtainChildByKey("task_comm_1").value = Edit_task1;
    teMyDoc.custom_elems.ObtainChildByKey("task_comm_2").value = Edit_task2;
    teMyDoc.custom_elems.ObtainChildByKey("task_comm_3").value = Edit_task3;

    myDoc.Save();
    curDoc = myDoc;
}

if (checkbox1 != "") {
    if (!createDossier(curDoc.TopElem.object_id, checkbox1, MyDateAccess)) {
        showException("Сотрудник не найден");
    }

    check_combo(MyCombo1, MyDate1, curDoc, 1, custom_templates.object_data_type.items[0].sheets[1].title);
    check_combo(MyCombo2, MyDate2, curDoc, 2, custom_templates.object_data_type.items[0].sheets[2].title);
    check_combo(MyCombo3, MyDate3, curDoc, 3, custom_templates.object_data_type.items[0].sheets[3].title);
    check_combo(MyCombo4, MyDate4, curDoc, 4, custom_templates.object_data_type.items[0].sheets[4].title);
    check_combo(MyCombo5, MyDate5, curDoc, 5, custom_templates.object_data_type.items[0].sheets[5].title);
    check_combo(MyCombo6, MyDate6, curDoc, 6, custom_templates.object_data_type.items[0].sheets[6].title);
} else {
    showException("Для создания сертификата установите галочку 'Пройдена подготовка / Допущен к сертификации'");
}

addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

MESSAGE = '<span style="color:green;font-weight:bold">Сохранено</span>';