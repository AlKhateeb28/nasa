-- GET DATA FROM XML AS VIEW
WITH _lectors AS (SELECT es.id AS event_id,
    T.c.value('id[1]', 'varchar(max)') AS phase_id,
    T.c.value('lector_id[1]', 'varchar(max)') AS lector_id,
    T.c.value('start_date[1]', 'varchar(max)') AS start_date,
    T.c.value('finish_date[1]', 'varchar(max)') AS finish_date,
    cs.fullname
FROM [WTDB].[dbo].events es
    INNER JOIN [WTDB].[dbo].event e ON es.id = e.id
    CROSS APPLY e.data.nodes('event/phases/phase') T(c)
    INNER JOIN [WTDB].[dbo].lectors ls ON T.c.value('lector_id[1]', 'bigint') = ls.id
    INNER JOIN [WTDB].[dbo].collaborators cs ON ls.person_id = cs.id
    WHERE es.id = 7190550638579545838
)
SELECT _ls.*
FROM _lectors _ls
ORDER BY _ls.lector_id