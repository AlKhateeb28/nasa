<%
// 7266009075903625099
function addLogMessage(loggerName, message) { EnableLog(loggerName, true); try { if (message == null) { message = "Empty message"; } LogEvent(loggerName, message); } catch (e) { throw new Error(e); } finally { EnableLog(loggerName, false); } }

var BOSS_TYPE_ID = 7260247233658818719;
var PERSON_CODE_PREFIX = "ock_muc_";
var EVENT_RESULT_TYPE_ID = 7266298331481502038;
var EVENT_TYPE_ID = "education_method";
var EDUCATION_ORG_ID = 7259999796767030466;

function isInnValid(inn) {
    funcManagerList = ArrayDirect(XQuery("sql: " +
        " SELECT fm.object_id AS id, " +
        " 			os.code " +
        " FROM [WTDB].[dbo].func_managers fm " +
        " INNER JOIN [WTDB].[dbo].orgs os ON fm.object_id = os.id AND os.code = '" + Trim(inn) + "'" +
        " WHERE fm.person_id = " + curUserID +
        "	AND fm.catalog = 'org' " +
        "	AND fm.boss_type_id = " + BOSS_TYPE_ID));

    if (ArrayCount(funcManagerList) > 0) {
        return true;
    }

    return false;
}

function getNameParts(name) {
    nameParts = name.split(" ");

    namePartsLength = ArrayCount(nameParts);

    if (namePartsLength == 2) {
        return {
            lenght: ArrayCount(nameParts),
            name: Trim(nameParts[1]),
            fatherName: "",
            surname: Trim(nameParts[0])
        }
    } else if (namePartsLength == 3) {
        return {
            lenght: ArrayCount(nameParts),
            name: Trim(nameParts[1]),
            fatherName: Trim(nameParts[2]),
            surname: Trim(nameParts[0])
        }
    } else {
        return {
            lenght: ArrayCount(nameParts),
            name: "",
            fatherName: "",
            surname: ""
        }
    }
}

function isNameValid(fullname) {
    rusChars = ["а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ь", "ы", "ъ", "э", "ю", "я", " ", "-"];

    if (StrCharCount(fullname) < 2) {
        return false;
    }

    // CHECK ON NON RUSSIAN CHARS
    loweredName = StrLowerCase(fullname);
    for (rusChar in rusChars) {
        loweredName = StrReplace(loweredName, rusChar, "");
    }

    if (StrCharCount(loweredName) > 0) {
        return false;
    }

    // CHECK NAME PARTS
    var nameParts = getNameParts(fullname);

    if (nameParts.lenght == 3) {
        var name = nameParts.name;
        var fatherName = nameParts.fatherName;
        var surname = nameParts.surname;

        if (fatherName == "-") {
            if (StrCharCount(name) < 2 || StrCharCount(surname) < 2) {
                return false;
            }
        } else {
            if (StrCharCount(name) < 2 || StrCharCount(fatherName) < 2 || StrCharCount(surname) < 2) {
                return false;
            }
        }
    } else if (nameParts.lenght == 2) {
        var name = nameParts.name;
        var surname = nameParts.surname;

        if (StrCharCount(name) < 2 || StrCharCount(surname) < 2) {
            return false;
        }
    } else {
        return false;
    }

    return true;
}

function normalizeName(name) {
    name = StrReplace(name, "Ё", "Е");
    name = StrReplace(name, "ё", "е");

    name = Trim(name);

    nameChars = StrToCharArray(name);

    metSpace = false;

    collectedName = "";

    for (char in nameChars) {
        if (char != " ") {
            if (metSpace) {
                collectedName += " ";

                metSpace = false;
            }

            collectedName += char;
        } else {
            metSpace = true;
        }
    }

    return collectedName;
}

function getUniqueCode() {
    a1 = StrDate(Date()).split(" ");
    a2 = a1[0].split(".");
    a3 = a1[1].split(":");

    code = PERSON_CODE_PREFIX + a2[2] + a2[1] + a2[0] + "_" + a3[0] + a3[1] + a3[2] + "_" + tools.random_string(5);

    collaboratorCodeList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].collaborators " +
        " WHERE code = '" + code + "' "));

    if (ArrayCount(collaboratorCodeList) > 0) {
        code += "@2" + tools.random_string(3);
    }

    return code;
}

function addPersonToEvent(personId, eventId) {
    tools.add_person_to_event(personId, eventId, null, null, null, curUserID, null);

    eventResultList = ArrayDirect(XQuery("sql: " +
        " SELECT id " +
        " FROM [WTDB].[dbo].event_results " +
        " WHERE event_id = " + eventId +
        "      AND person_id = " + personId));

    if (ArrayCount(eventResultList) > 0) {
        eventResultDoc = tools.open_doc(eventResultList[0].id);

        eventResultDoc.TopElem.event_result_type_id = EVENT_RESULT_TYPE_ID;

        eventResultDoc.Save();
    }
}

function addPreparationToEvent(eventDocTE) {
    eventDocTE.even_preparations.Clear();

    tutorList = ArrayDirect(XQuery("sql: " +
        " SELECT cs.fullname " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "   INNER JOIN[WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "   INNER JOIN[WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
        "   LEFT JOIN[WTDB].[dbo].subdivisions ss ON cs.position_id = ss.id " +
        " WHERE cs.id = " + curUserID));

    preparation = eventDocTE.even_preparations.AddChild();

    preparation.even_preparation_id = eventObject.preparationId;
    preparation.person_id = curUserID;
    preparation.person_fullname = tutorList[0].fullname;
    preparation.status_id = "plan";
}

function addTrainersToEvent(eventDocTE, trainers) {
    eventDocTE.tutors.Clear();

    for (trainer in trainers) {
        tutorList = ArrayDirect(XQuery("sql: " +
            " SELECT cs.fullname, " +
            "       cs.code AS person_code, " +
            "       os.id AS org_id, " +
            "       os.code AS org_code, " +
            "       os.name AS org_name, " +
            "       ps.id AS position_id, " +
            "       ps.name AS position_name, " +
            "       ps.code AS position_code, " +
            "       ss.id AS subdivision_id, " +
            "       ss.name AS subdivision_name " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "   INNER JOIN[WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            "   INNER JOIN[WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
            "   LEFT JOIN[WTDB].[dbo].subdivisions ss ON cs.position_id = ss.id " +
            " WHERE cs.id = " + trainer.id));

        tutor = eventDocTE.tutors.AddChild();

        tutor.collaborator_id = trainer.id;
        tutor.person_fullname = tutorList[0].fullname;
        tutor.person_code = tutorList[0].person_code;
        tutor.person_position_id = tutorList[0].position_id;
        tutor.person_position_name = tutorList[0].position_name;
        tutor.person_position_code = tutorList[0].position_code;
        tutor.person_org_id = tutorList[0].org_id;
        tutor.person_org_name = tutorList[0].org_name;
        tutor.person_org_code = tutorList[0].org_code;
        tutor.person_subdivision_id = tutorList[0].subdivision_id;
        tutor.person_subdivision_name = tutorList[0].subdivision_name;
        tutor.main = 0;
    }
}

function addCollaboratorToEvent(eventDoc, collaboratorId) {
    collaboratorToEventList = ArrayDirect(XQuery("sql: " +
        " SELECT cs.fullname, " +
        "       cs.code AS person_code, " +
        "       os.id AS org_id, " +
        "       os.code AS org_code, " +
        "       os.name AS org_name, " +
        "       ps.id AS position_id, " +
        "       ps.name AS position_name " +
        " FROM [WTDB].[dbo].collaborators cs " +
        "   INNER JOIN[WTDB].[dbo].orgs os ON cs.org_id = os.id " +
        "   INNER JOIN[WTDB].[dbo].positions ps ON cs.position_id = ps.id " +
        " WHERE cs.id = " + collaboratorId));

    collaborator = eventDoc.TopElem.collaborators.AddChild();

    collaborator.collaborator_id = collaboratorId;
    collaborator.person_fullname = collaboratorToEventList[0].fullname;
    collaborator.person_code = collaboratorToEventList[0].person_code;
    collaborator.person_position_id = collaboratorToEventList[0].position_id;
    collaborator.person_position_name = collaboratorToEventList[0].position_name;
    collaborator.person_org_id = collaboratorToEventList[0].org_id;
    collaborator.person_org_name = collaboratorToEventList[0].org_name;
    collaborator.person_org_code = collaboratorToEventList[0].org_code;
    collaborator.can_use_camera = 0;
    collaborator.can_use_microphone = 0;

    eventDoc.Save();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Added collaborator");
}

function validateDates(start, finish) {
    if(Date(finish) < Date(start)) {
        result.lowFinish = true;

        throw Error("LOW_FINISH");
    }

    finish = finish + " 08:00:00";

    day = Day(Date());
    month = Month(Date());
    year = Year(Date());

    createAndEditStart = Date("01." + month + "." + year + " 00:00:00");
    verificationStart = Date("01." + month + "." + year + " 00:00:00");
    verificationFinish = Date("05." + month + "." + year + " 23:59:59");    

    if (verificationStart <= Date() && Date() <= verificationFinish) {
        result.isVerification = true;

        if (Date(finish) <= DateOffset(createAndEditStart, -1)) {
            result.isDateValid = false;
            result.start = StrDate(createAndEditStart, false, false);

            throw Error("BLOCKED");
        }
    } else {
        if (Date(finish) <= DateOffset(createAndEditStart, -1)) {
            result.isDateValid = false;
            result.start = StrDate(createAndEditStart, false, false);

            throw Error("BLOCKED");
        }
    }
}

var agentId = 7266009075903625099;
var loggerName = "web_7266009075903625099";

var result = {};
result.warnings = [];
result.errorMessage = "";
result.message = "";
result.lowFinish = false;
result.isVerification = false;
result.isDateValid = true;
result.start = "";

try {
    jsonParam = Request.Query.GetOptProperty("json");

    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Processing...");

    eventObject = ParseJson(jsonParam);

    validateDates(eventObject.startDate, eventObject.finishDate);

    eventDoc = null;

    if (eventObject.id == "") {
        curUsercollaboratorList = ArrayDirect(XQuery("sql: " +
            " SELECT cs.code AS person_code, " +
            "       os.code AS org_code " +
            " FROM [WTDB].[dbo].collaborators cs " +
            "   INNER JOIN[WTDB].[dbo].orgs os ON cs.org_id = os.id " +
            " WHERE cs.id = " + curUserID + " "));

        if (ArrayCount(curUsercollaboratorList) == 0) {
            throw Error("Не найдена организация текущего пользователя!");
        }

        // NEW EVENT
        eventDoc = OpenNewDoc('x-local://wtv/wtv_event.xmd');
        eventDoc.BindToDb(DefaultDb);

        eventDocTE = eventDoc.TopElem;

        eventDocTE.status_id = eventObject.status;
        eventDocTE.code = "S_" + curUsercollaboratorList[0].org_code + "_" + curUsercollaboratorList[0].person_code;
        eventDocTE.type_id = EVENT_TYPE_ID;

        addLogMessage(loggerName, "[agent.id: " + agentId + "] Type: " + eventDocTE.type_id);

        eventDocTE.education_org_id = EDUCATION_ORG_ID;
        eventDocTE.education_method_id = eventObject.eduMethodId;
        eventDocTE.name = eventObject.methodName;
        eventDocTE.start_date = Date(eventObject.startDate);
        eventDocTE.finish_date = Date(eventObject.finishDate);
        eventDocTE.custom_elems.ObtainChildByKey("nps").value = eventObject.nps;
        eventDocTE.comment = eventObject.comment;

        // Блок preparation
        addPreparationToEvent(eventDocTE);

        // Блок tutors
        addTrainersToEvent(eventDocTE, eventObject.trainers);

        eventDoc.Save();

        eventObject.id = eventDoc.DocID + "";
    } else {
        // EDIT EVENT
        eventDoc = tools.open_doc(OptInt(eventObject.id));

        if (eventDoc == undefined) {
            throw Error("Редактируемое мероприятие с ID " + eventObject.id + " не существует!");
        }

        eventDocTE = eventDoc.TopElem;

        eventDocTE.status_id = eventObject.status;
        eventDocTE.type_id = EVENT_TYPE_ID;
        eventDocTE.education_method_id = eventObject.eduMethodId;
        eventDocTE.name = eventObject.methodName;
        eventDocTE.start_date = Date(eventObject.startDate);
        eventDocTE.finish_date = Date(eventObject.finishDate);
        eventDocTE.custom_elems.ObtainChildByKey("nps").value = eventObject.nps;
        eventDocTE.comment = eventObject.comment;

        // Блок preparation
        addPreparationToEvent(eventDocTE);

        // Блок tutors
        addTrainersToEvent(eventDoc.TopElem, eventObject.trainers);

        eventDoc.Save();
    }

    // SAVE NEW PERSONS
    for (person in eventObject.persons) {
        person.validInn = true;
        person.validName = true;

        if (person.isNew) {
            person.validName = isNameValid(person.name);
            person.validInn = isInnValid(person.inn);

            if (person.validInn && person.validName) {
                person.name = normalizeName(person.name);

                orgList = ArrayDirect(XQuery("sql: " +
                    " SELECT os.id " +
                    " FROM [WTDB].[dbo].orgs os " +
                    " WHERE os.code = '" + person.inn + "' "));

                if (ArrayCount(orgList) > 0) {
                    dataList = ArrayDirect(XQuery("sql: " +
                        " SELECT cs.id AS id, " +
                        "       os.id AS org_id " +
                        " FROM [WTDB].[dbo].collaborators cs " +
                        "   INNER JOIN[WTDB].[dbo].orgs os ON cs.org_id = os.id " +
                        " WHERE UPPER(cs.fullname) = UPPER('" + StrUpperCase(person.name) + "') " +
                        "   AND cs.code LIKE '%" + PERSON_CODE_PREFIX + "%'  " +
                        "   AND os.code = '" + person.inn + "' "));

                    if (ArrayCount(dataList) == 0) {
                        // CREATE COLLABORATOR
                        collaboratorDoc = OpenNewDoc('x-local://wtv/wtv_collaborator.xmd');
                        collaboratorDoc.BindToDb(DefaultDb);

                        collaboratorDocTE = collaboratorDoc.TopElem;

                        code = getUniqueCode();

                        collaboratorDocTE.code = code;
                        collaboratorDocTE.login = code;

                        nameParts = getNameParts(person.name);

                        collaboratorDocTE.firstname = normalizeName(nameParts.name);
                        collaboratorDocTE.middlename = normalizeName(nameParts.fatherName);
                        collaboratorDocTE.lastname = normalizeName(nameParts.surname);
                        collaboratorDocTE.password = tools.random_string(20);
                        collaboratorDocTE.custom_elems.ObtainChildByKey("date_register").value = Date();
                        collaboratorDocTE.access.web_banned = true;
                        collaboratorDocTE.last_import_date = Date();
                        collaboratorDocTE.birth_date.Clear();
                        collaboratorDocTE.org_id = OptInt(orgList[0].id);

                        // CREATE POSITION
                        positionDoc = OpenNewDoc('x-local://wtv/wtv_position.xmd');
                        positionDoc.BindToDb(DefaultDb);

                        positionDocTE = positionDoc.TopElem;
                        positionDocTE.name = person.position;
                        positionDocTE.basic_collaborator_id = collaboratorDoc.DocID;
                        positionDocTE.org_id = OptInt(orgList[0].id);

                        collaboratorDocTE.position_id = positionDoc.DocID;
                        collaboratorDocTE.position_name = person.position;

                        positionDoc.Save();
                        collaboratorDoc.Save();

                        person.id = collaboratorDoc.DocID + "";

                        addPersonToEvent(collaboratorDoc.DocID, eventDoc.DocID);

                        addCollaboratorToEvent(eventDoc, collaboratorDoc.DocID);
                    } else {
                        personId = dataList[0].id;

                        addPersonToEvent(personId, eventDoc.DocID);

                        addCollaboratorToEvent(eventDoc, personId);
                    }
                } else {
                    warning = "Не найдена организация с ИНН " + person.inn + " у " + person.name;

                    result.warnings.push(warning);

                    addLogMessage(loggerName, "[agent.id: " + agentId + "] Organization with INN " + person.inn + " on " + person.name + " is not exist!");
                }

            }
        } else {
            // CHECK TO DELETE EVENT RESULT
            if (person.isDelete) {
                eventResultList = ArrayDirect(XQuery("sql: " +
                    " SELECT ers.id " +
                    " FROM [WTDB].[dbo].event_results ers " +
                    " WHERE ers.event_id = " + eventDoc.DocID +
                    "       AND ers.person_id = " + person.id));

                if (ArrayCount(eventResultList) > 0) {
                    tools.del_person_from_event(OptInt(person.id), eventDoc.DocID);
                }
            }
        }
    }

    eventDoc.TopElem.custom_elems.ObtainChildByKey("web_upload_finish").value = "true";
    eventDoc.Save();

    addLogMessage(loggerName, "[agent.id: " + agentId + "] Finished");

    result.event = eventObject;

    Response.Write(EncodeJson(result));
} catch (e) {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] ERROR: " + e);

    if (e.message == "LOW_FINISH") {        
    } else if (e.message == "BLOCKED") {
    } else {
        result.errorMessage = "#" + e;
    }

    Response.Write(EncodeJson(result));
}
%>