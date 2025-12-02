// 6961503651706126764
if( LdsIsClient ) {
    try {
        object_ids_arr = OBJECTS_ID_STR.split(';');
        n = 0;
        for ( object_id in object_ids_arr ) {
            object_doc = tools.open_doc( object_id );

            if(object_doc != undefined) {
                if (object_doc.TopElem.Name == "event_result") {
                    col_in_event_result = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/id=" + object_doc.TopElem.person_id + " return $elem"));
                    col_event_results_arr = XQuery("for $er in event_results where $er/person_id = " + object_doc.TopElem.person_id + " return $er");
                    if (ArrayOptFirstElem(col_event_results_arr) != undefined) {
                        for (col_event_result in col_event_results_arr) {
                            event_result_doc = tools.open_doc(col_event_result.id);

                            if(event_result_doc != undefined) {
                                event_result_doc_te = event_result_doc.TopElem;
                                event_result_doc_te.person_fullname = col_in_event_result.fullname;
                                event_result_doc.Save();

                                event_doc = tools.open_doc(col_event_result.event_id);

                                if(event_doc != undefined) {
                                    event_doc_te = event_doc.TopElem;
                                    found_col = ArrayOptFindByKey(event_doc_te.collaborators, col_event_result.person_id, 'collaborator_id');
                                    found_col.person_fullname = col_in_event_result.fullname;
                                    event_doc.Save();
                                    n++;
                                }
                            }
                        }
                    }
                }
                if (object_doc.TopElem.Name == "event") {
                    cols_arr = object_doc.TopElem.collaborators;
                    for (col in cols_arr) {
                        col_in_event = ArrayOptFirstElem(XQuery("for $elem in collaborators where $elem/id=" + col.collaborator_id + " return $elem"));
                        col_event_results_arr = XQuery("for $er in event_results where $er/person_id = " + col_in_event.id + " return $er");
                        if (ArrayOptFirstElem(col_event_results_arr) != undefined) {
                            for (col_event_result in col_event_results_arr) {
                                event_result_doc = tools.open_doc(col_event_result.id);

                                if(event_result_doc != undefined) {
                                    event_result_doc_te = event_result_doc.TopElem;
                                    event_result_doc_te.person_fullname = col_in_event.fullname;
                                    event_result_doc.Save();

                                    event_doc = tools.open_doc(col_event_result.event_id);

                                    if(event_doc != undefined) {
                                        event_doc_te = event_doc.TopElem;
                                        found_col = ArrayOptFindByKey(event_doc_te.collaborators, col_event_result.person_id, 'collaborator_id');
                                        found_col.person_fullname = col_in_event.fullname;
                                        event_doc.Save();
                                        n++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        alert( "Обновлено " + n + " мероприятий" );
    } catch ( err ) { alert( 'AGENT - 6956886778346619995, ERROR - ' + err ) }
}