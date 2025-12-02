// 6989155923566030038
arr = ArraySelectAll( XQuery( "sql:
WITH Table_1 AS (
    SELECT
id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id
FROM active_learnings
WHERE
active_learnings.person_id = " + curObjectID + "
AND active_learnings.course_id IN (" + courses_ids_arr + ")
UNION
SELECT
id, course_id, course_name, start_usage_date, last_usage_date, start_learning_date, score, state_id
FROM learnings
WHERE
learnings.person_id = " + curObjectID + "
AND learnings.course_id IN (" + courses_ids_arr + ")
)
SELECT
Table_1.id AS id
    , Table_1.course_id AS course_id
    , Table_1.course_name AS course_name
    , Table_1.score AS score
    , Table_1.start_usage_date AS start_usage_date
    , Table_1.last_usage_date AS last_usage_date
    , Table_1.start_learning_date AS start_learning_date
    , [common.learning_states].name AS state_name
FROM Table_1
LEFT JOIN [common.learning_states]
ON [common.learning_states].id = Table_1.state_id
ORDER BY
Table_1.course_name ASC
    , Table_1.score DESC
    , Table_1.start_usage_date DESC
" ) )
final_array = ArraySelectDistinct( arr, "This.course_id" )

if ( sSearchWord != '' ) {
    temp_arr = []
    for ( elem in final_array ) {
        if ( StrContains( elem.course_name, sSearchWord, true ) || StrContains( elem.state_name, sSearchWord, true ) ) {
            temp_arr.push( elem )
        }
    }
    final_array = ArraySelectAll( temp_arr )
}

SORT.FIELD;
PAGING.MANUAL = false;
PAGING.SIZE = 10;
PAGING.TOTAL = ArrayCount(final_array);

RESULT = ArraySort(final_array, SORT.FIELD, ((SORT.DIRECTION == "DESC") ? "-" : "+"));

COLUMNS = ([
    { "data" : "course_name", "hidden" : false, "sortable" : true, "title" : "Электронный курс" }
    , { "data" : "state_name", "hidden" : false, "sortable" : true, "title" : "Статус" }
    , { "data" : "score", "hidden" : false, "sortable" : true, "title" : "Балл" }
    , { "data" : "id", "hidden" : true, "sortable" : false, "title" : "ID" }
])