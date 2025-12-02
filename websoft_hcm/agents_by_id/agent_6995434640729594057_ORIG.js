// 6995434640729594057
//if( LdsIsClient == true ) {
try{
    counter = 0
    arr = OBJECTS_ID_STR.split( ';' )
    for( elem in arr ){
        try{
            doc = tools.open_doc( elem )
            te = doc.TopElem
            if ( te.Name == 'active_learning' || te.Name == 'learning' ) {
                sum_score = 0
                sum_time = 0
                myDate = Date()
                for ( part in te.parts ) {
                    /*
                    <start_learning_date>2021-06-01T18:25:10+00:00</start_learning_date>
                        <time>265000</time>
                        <start_usage_date>2021-06-01T18:25:10+00:00</start_usage_date>
                        <last_usage_date>2021-06-01T18:25:10+00:00</last_usage_date>
                        <state_id>2</state_id>
                        <score>100</score>
                        <cur_score>0</cur_score>
                        <cur_state_id>0</cur_state_id>

                    <last_usage_part_code>PART_7</last_usage_part_code>
                    <last_usage_date>2021-06-03T21:15:12+00:00</last_usage_date>
                    <score>1300</score>
                    <time>7180000</time>
                    */
                    if ( part.state_id == 2 ) {
                        sum_score += part.score
                    } else {
                        sum_score += part.max_score
                        sum_time += 1000
                        part.time = 1000
                        part.state_id = 2
                        part.cur_state_id = 2
                        part.score = part.max_score
                        part.start_usage_date = myDate
                        part.last_usage_date = myDate
                        part.cur_score = part.max_score
                    }
                }
                te.start_learning_date = myDate
                te.last_usage_date = myDate
                te.score = sum_score
                te.time = sum_time
                doc.Save()
                counter += 1
            }
        } catch( er ) {
            continue
        }
    }
    alert( "Обработано " + counter + " записей из " + ArrayCount( arr ) )
} catch( err ) {
    alert( err )
}
/*
} else {
	alert( "Для корректной работы агент необходимо запускать на стороне клиента" )
}*/