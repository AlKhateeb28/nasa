//6886868605917821984
sConstApplicationCode = "websoftcontinuouslearning";
sConstLogName = "reglament_" + sConstApplicationCode;

EnableLog(sConstLogName);
function toLog(msg)
{
    LogEvent(sConstLogName, msg);
}

if (OptInt(OBJECT_ID) != undefined)
{
    var arrEducationPlanIDs = [OptInt(OBJECT_ID)]
}
else
{
    var arrEducationPlanIDs = ArrayExtract(ArrayOptFirstElem(tools_app.get_application_objects(sConstApplicationCode, "education_plan")).xq_result, "This.id.Value");
}

var docEducationPlan, teEducationPlan;
var dStartDate, sMsg, bChanged;
for (itemEducationPlanID in arrEducationPlanIDs)
{
    try
    {
        docEducationPlan = tools.open_doc(itemEducationPlanID);
        teEducationPlan = docEducationPlan.TopElem;

        if (OptInt(teEducationPlan.state_id) != 0 && OptInt(teEducationPlan.state_id) != 1)
            continue;

        toLog(StrReplace('Обработка плана обучения "{PARAM1}".', "{PARAM1}", teEducationPlan.name.Value));

        switch (teEducationPlan.type.Value)
        {
            case "collaborator":
                tools.call_code_library_method('libEducation', 'update_education_plan', [teEducationPlan.id.Value, docEducationPlan, (teEducationPlan.person_id.HasValue ? teEducationPlan.person_id.Value : teEducationPlan.object_id.Value), true]);
                break;
            case "group":
            {
                checkEducation = true;
                docGroup = tools.open_doc(OptInt(docEducationPlan.TopElem.object_id.Value, 0));
                if (docGroup != undefined)
                {
                    teGroup = docGroup.TopElem;
                    for (itemCollaborator in XQuery("for $elem in group_collaborators where $elem/group_id=" + XQueryLiteral(docEducationPlan.TopElem.object_id.Value) + " return $elem/Fields('collaborator_id')"))
                    {
                        curCol = ArrayOptFindByKey(teGroup.collaborators, itemCollaborator.collaborator_id, 'collaborator_id');
                        if (curCol != undefined)
                        {
                            _arrDesc = [];
                            try
                            {
                                _arrDesc = tools.read_object(curCol.desc);
                                if (!IsArray(_arrDesc)) _arrDesc = [];
                            }
                            catch (err)
                            {
                                _arrDesc = [];
                            }

                            _oDesc = ArrayOptFindByKey(_arrDesc, docEducationPlan.TopElem.id.Value, 'education_plan_id');
                            if (_oDesc != undefined)
                            {
                                if (_oDesc.status == 'cancel' || _oDesc.status == 'lock')
                                {
                                    checkEducation = false;
                                }
                                if (_oDesc.status == 'lock' && _oDesc.date_finish != '' && CurDate >= ParseDate(_oDesc.date_finish))
                                {
                                    _oDesc.status = '';
                                    _oDesc.date_start = '';
                                    _oDesc.date_finish = '';
                                }
                            }
                        }
                        if (checkEducation)
                            tools.call_code_library_method('libEducation', 'update_education_plan', [teEducationPlan.id.Value, docEducationPlan, itemCollaborator.collaborator_id.Value, true]);
                    }
                }
                break;
            }
        }

        tools_app.get_application_lib( sConstApplicationCode ).update_events_by_model(itemEducationPlanID, docEducationPlan, null, true);

        bChanged = false;
        for (itemProgram in teEducationPlan.programs)
        {
            dStartDate = itemProgram.plan_date.HasValue ? DateNewTime(itemProgram.plan_date.Value) : (itemProgram.create_date.HasValue ? DateNewTime(itemProgram.create_date.Value) : null);

            if (OptInt(itemProgram.state_id.Value) < 2 && itemProgram.finish_date.HasValue && DateNewTime(Date()) > DateNewTime(itemProgram.finish_date.Value))
            {
                itemProgram.state_id = 2;
                bChanged = true;
                sMsg = StrReplace(StrReplace(StrReplace('Изменен статус задачи [{PARAM1}] в плане обучения [{PARAM2}] на "{PARAM3}".', "{PARAM1}", itemProgram.id.Value + " : " + itemProgram.name.Value + "(" + itemProgram.type.Value + ")"), "{PARAM2}", teEducationPlan.id.Value + " : " + teEducationPlan.name.Value), "{PARAM3}", "Завершен")
                toLog(sMsg);
            }
            else if (OptInt(itemProgram.state_id.Value) > 0 && dStartDate != null && DateNewTime(Date()) < dStartDate)
            {
                itemProgram.state_id = 0;
                bChanged = true;
                sMsg = StrReplace(StrReplace(StrReplace('Изменен статус задачи [{PARAM1}] в плане обучения [{PARAM2}] на "{PARAM3}".', "{PARAM1}", itemProgram.id.Value + " : " + itemProgram.name.Value + "(" + itemProgram.type.Value + ")"), "{PARAM2}", teEducationPlan.id.Value + " : " + teEducationPlan.name.Value), "{PARAM3}", "Назначен");
                toLog(sMsg);
            }
            else if (OptInt(itemProgram.state_id.Value) != 1 && (dStartDate != null && DateNewTime(Date()) >= dStartDate) && (itemProgram.finish_date.HasValue && DateNewTime(Date()) <= DateNewTime(itemProgram.finish_date.Value)))
            {
                itemProgram.state_id = 1;
                bChanged = true;
                sMsg = StrReplace(StrReplace(StrReplace('Изменен статус задачи [{PARAM1}] в плане обучения [{PARAM2}] на "{PARAM3}".', "{PARAM1}", itemProgram.id.Value + " : " + itemProgram.name.Value + "(" + itemProgram.type.Value + ")"), "{PARAM2}", teEducationPlan.id.Value + " : " + teEducationPlan.name.Value), "{PARAM3}", "В процессе");
                toLog(sMsg);
            }
        }

        if (bChanged)
        {
            docEducationPlan.Save();
        }
    }
    catch (err)
    {
        toLog("ERROR: Plan ID:[" + itemEducationPlanID + "]:\r\n" + err);
    }
}