// 6682653532914604736
function addLogMessage(loggerName,message){EnableLog(loggerName,true);try{if(message==null){message="Empty message";}LogEvent(loggerName,message);}catch(e){throw new Error(e);}finally{EnableLog(loggerName,false);}}

/*
	state
	0	- не выбран
	1	- выбран
	2	- не выбран, но раскрыт ( для родительских )
*/

var agentId = 6682653532914604736;
var loggerName = "action_6682653532914604736";;

try {
    addLogMessage(loggerName, "[agent.id: " + agentId + "] -------------------");
    addLogMessage(loggerName, "[agent.id: " + agentId + "] Started");

    switch(action) {
        case "get_action":
            addLogMessage(loggerName, "[agent.id: " + agentId + "] 1");

            //alert(UrlDecode( states))
            iEducationPlanID = Int(education_plan_id);
            teEducationPlan = OpenDoc(UrlFromDocID(iEducationPlanID)).TopElem;
            aProgramStates = tools.read_object(UrlDecode(states));
            catProgram = teEducationPlan.programs.GetOptChildByKey(Int(program_id));
            bHasChild = ArrayOptFind(teEducationPlan.programs, "This.parent_progpam_id == " + catProgram.id.Value) != undefined;
            MESSAGE = "";

            for(catElem in ArraySort(aProgramStates, "Int(This.id) == Int(catProgram.id.Value) ? 1 : 0", "+")) {
                if(Int(catElem.id) == Int(catProgram.id.Value)) {
                    if(catElem.state == 0) {
                        if(catElem.state == 0) {
                            MESSAGE += "SHOW=StackPanelProgram" + catProgram.id + "dark;";
                            MESSAGE += "HIDE=StackPanelProgram" + catProgram.id + ";";
                        }

                        if(bHasChild){
                            MESSAGE += "SHOW=StackPanelProgram" + catProgram.id + "typedarkselected;HIDE=StackPanelProgram" + catProgram.id + "type;SHOW=StackPanel" + catProgram.id + "a;";
                        } else {
                            MESSAGE += "SHOW=StackPanelProgram" + catProgram.id + "typedark;HIDE=StackPanelProgram" + catProgram.id + "type;";
                        }

                        catElem.state = 1;
                    } else {
                        MESSAGE += "SHOW=StackPanelProgram" + catProgram.id + ";";
                        MESSAGE += "HIDE=StackPanelProgram" + catProgram.id + "dark;";
                        MESSAGE += "SET=ProgramID,main;";

                        if(bHasChild) {
                            if(catElem.state == 1) {
                                MESSAGE += "SHOW=StackPanelProgram" + catProgram.id + "type;HIDE=StackPanelProgram" + catProgram.id + "typedarkselected;HIDE=StackPanel" + catProgram.id + "a;";
                            } else if(catElem.state == 2) {
                                MESSAGE += "SHOW=StackPanelProgram" + catProgram.id + "type;HIDE=StackPanelProgram" + catProgram.id + "typedarkparent;HIDE=StackPanel" + catProgram.id + "a;";
                            }
                        }
                        else
                            MESSAGE += "HIDE=StackPanelProgram" + catProgram.id + "typedark;SHOW=StackPanelProgram" + catProgram.id + "type;";

                        catElem.state = 0;
                    }

                    continue;
                }

                if(catElem.state == 1) {
                    MESSAGE += "SHOW=StackPanelProgram" + catElem.id + ";";
                    MESSAGE += "HIDE=StackPanelProgram" + catElem.id + "dark;";
                    bElemHasChild = ArrayOptFind(teEducationPlan.programs, "This.parent_progpam_id == " + catElem.id) != undefined;
                    if(bElemHasChild) {
                        catElem.state = 2;
                        MESSAGE += "HIDE=StackPanelProgram" + catElem.id + "typedarkselected;SHOW=StackPanelProgram" + catElem.id + "typedarkparent;";
                    } else {
                        catElem.state = 0;
                        MESSAGE += "HIDE=StackPanelProgram" + catElem.id + "typedark;SHOW=StackPanelProgram" + catElem.id + "type;";
                    }
                }
            }

            MESSAGE += "SET=ProgramStates," + UrlEncode(tools.object_to_text(aProgramStates, "json")) + ";";
            MESSAGE += "SET=LastProgramID," + catProgram.id + ";UPDATE=PanelEduPlanStages;";
            break;

        case "get_action_expend":
            addLogMessage(loggerName, "[agent.id: " + agentId + "] 2");

            //alert(UrlDecode(states))
            aProgramStates = tools.read_object(UrlDecode(states));
            catProgramID = Int(program_id);
            catProgram = ArrayOptFind(aProgramStates, "Int(This.id) == catProgramID");
            MESSAGE = "";

            if(catProgram != undefined) {
                switch(catProgram.state) {
                    case 0:
                        MESSAGE = "HIDE=StackPanelProgram" + catProgramID + "type;SHOW=StackPanelProgram" + catProgramID + "typedarkparent;SHOW=StackPanel" + catProgramID + "a;";
                        catProgram.state = 2;
                        break;

                    case 2:
                        MESSAGE = "SHOW=StackPanelProgram" + catProgramID + "type;HIDE=StackPanelProgram" + catProgramID + "typedarkparent;HIDE=StackPanel" + catProgramID + "a;";
                        catProgram.state = 0;
                        break;
                }
            }

            MESSAGE += "SET=ProgramStates," + UrlEncode(tools.object_to_text(aProgramStates, "json")) + ";";
            break;
    }
} catch(err) {
    ERROR = 1;
    MESSAGE = err;
    alert("education_plan_actions.bs " + err);
}
