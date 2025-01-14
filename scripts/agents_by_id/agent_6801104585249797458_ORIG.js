function getAllStatus(program, userId){

    aQuery = {};

    switch(program.type){
        case "course":
            aQuery = ArrayOptFirstElem( tools.xquery("for $elem in learnings where $elem/person_id = " + userId + " and $elem/course_id = " + program.object_id + " order by $elem/modification_date ascending return $elem") );

            if(aQuery == undefined){
                aQuery = ArrayOptFirstElem( tools.xquery("for $elem in active_learnings where $elem/person_id = " + userId + " and $elem/course_id = " + program.object_id + " order by $elem/modification_date ascending return $elem") );
            }

            if(aQuery != undefined){
                return aQuery.state_id;
            }
            return program.state_id;
        case "assessment":
            aQuery = ArrayOptFirstElem( tools.xquery("for $elem in test_learnings where $elem/person_id = " + userId + " and $elem/assessment_id = " + program.object_id + " order by $elem/modification_date ascending return $elem") );

            if(aQuery == undefined){
                aQuery = ArrayOptFirstElem( tools.xquery("for $elem in active_test_learnings where $elem/person_id = " + userId + " and $elem/assessment_id = " + program.object_id + " order by $elem/modification_date ascending return $elem") );
            }

            if(aQuery != undefined){
                return aQuery.state_id;
            }
            return program.state_id;
        case "material":
            if(program.catalog_name == "library_material"){
                aQuery = ArrayOptFirstElem( tools.xquery("for $elem in library_material_viewings where $elem/person_id = " + userId + " and $elem/material_id = " + program.object_id + " order by $elem/modification_date ascending return $elem") );

                if(aQuery != undefined){
                    switch(aQuery.state_id){
                        case "finished":
                            return 4;
                        case "active":
                            return 1;
                    }
                }
            }
            return program.state_id;
        default:
            return program.state_id;
    }

}
arrEducatPlan = ArraySelectAll( tools.xquery('for $elem in education_plans where person_id != null() return $elem') );

for(elem in arrEducatPlan){
    docEducatPlan = tools.open_doc(OptInt(elem.id));
    if( docEducatPlan != undefined ){
        for(program in docEducatPlan.TopElem.programs){
            program.state_id = OptInt(getAllStatus(program, docEducatPlan.TopElem.person_id), 0);
        }
    }
    docEducatPlan.Save();
}