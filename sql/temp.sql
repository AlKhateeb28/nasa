select ers.id, ers.event_result_type_id
from [WTDB].[dbo].event_results ers
    LEFT JOIN [WTDB].[dbo].event_result_types erts ON ers.event_result_type_id = erts.id
WHERE ers.id  = 7392915032424323745

--UPDATE [WTDB].[dbo].event_results SET event_result_type_id = 7101361738949288137 WHERE event_result_type_id = 7358374990179622584

select cs.fullname,
       l.data.value('(//custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') AS trener_type,
       ls.*
from [WTDB].[dbo].lectors ls
    inner join [WTDB].[dbo].collaborators cs on ls.person_id = cs.id
    inner join [WTDB].[dbo].lector l on ls.id = l.id
where ls.id

SELECT ls.id,
       T.c.value('lector_id[1]','varchar(max)') AS lector_id,
       e1.id,
       ls.lector_fullname AS lec_fio,
       l.data.value('(lector/custom_elems/custom_elem[name=''type_trener''])[1]/value[1]', 'varchar(max)') AS trener_type
FROM [WTDB].[dbo].events ev1
         INNER JOIN [WTDB].[dbo].event e1 ON ev1.id = e1.id
         CROSS APPLY e1.data.nodes('event/lectors/lector') T(c)
         INNER JOIN [WTDB].[dbo].lectors ls ON T.c.value('lector_id[1]','varchar(max)') = ls.id
         INNER JOIN [WTDB].[dbo].lector l ON T.c.value('lector_id[1]','varchar(max)') = l.id
ORDER BY lector_id

SELECT es.id,
    e.data.value('(//lectors/lector)[1]/lector_id[1]', 'varchar(max)') AS lector_id
FROM [WTDB].[dbo].events es
    INNER JOIN [WTDB].[dbo].event e ON es.id = e.id
WHERE es.id = 7105267823917397415