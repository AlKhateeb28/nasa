WITH _lectors AS (
    SELECT events.id, lectors.lector_fullname AS lector_fio
    FROM [WTDB].[dbo].events
             INNER JOIN [WTDB].[dbo].event e ON events.id = e.id
             CROSS APPLY e.data.nodes('event/lectors/lector') T(c)
             INNER JOIN [WTDB].[dbo].lectors
                        ON T.c.value('lector_id[1]','varchar(max)') = lectors.id
)
SELECT id, lector_fio = STUFF (
        (
            SELECT '|' + lector_fio
            FROM _lectors tmp
            WHERE tmp.id = ls.id
            FOR XML PATH ('')
        )
    , 1, 1, '')
INTO _temp_lectors
FROM _lectors ls
GROUP BY ls.id;

WITH _preparations AS (
    SELECT es.id, T.c.value('person_fullname[1]', 'varchar(max)') AS pre_fio
    FROM [WTDB].[dbo].events es
             LEFT JOIN [WTDB].[dbo].event e ON es.id = e.id
             CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c)
)
SELECT id, preparation_fio = STUFF (
        (
            SELECT '|' + pre_fio
            FROM _preparations tmp
            WHERE tmp.id = ps.id
            FOR XML PATH ('')
        )
    , 1, 1, '')
INTO _temp_preparations
FROM _preparations ps
GROUP BY id;

SELECT rs.name AS region_name,
       f_rs.name AS fact_region_name,
       os.code AS inn,
       os.name AS org_name,
       cs.code AS person_code,
       cs.fullname AS fullname,
       ps.name AS position_name,
       IIF(ers.is_assist = 1, 'Истина', 'Ложь') AS is_assist,
       es.education_org_name,
       ems.id AS education_method_id,
       em.data.value('(//custom_elems/custom_elem[name=''subcode'']/value)[1]', 'varchar(max)') AS subcode,
       ems.name AS education_method_name,
       es.id AS event_id,
       es.code AS event_code,
       es.name AS event_name,
       es.start_date,
       es.finish_date,
       e.data.value('(event/place)[1]', 'varchar(max)') AS place,
       CASE
           WHEN es.event_form = 'conference' THEN 'конференция'
           WHEN es.event_form = 'examination' THEN 'сертификация'
           WHEN es.event_form = 'game' THEN 'деловая игра'
           WHEN es.event_form = 'meeting' THEN 'стартовое совещание'
           WHEN es.event_form = 'meth_day' THEN 'методический день'
           WHEN es.event_form = 'pered_prog' THEN 'передача программ'
           WHEN es.event_form = 'praktikum' THEN 'тренинг-площадка'
           WHEN es.event_form = 'scan' THEN 'сканирование'
           WHEN es.event_form = 'seminar' THEN 'семинар'
           WHEN es.event_form = 'stagirovka' THEN 'стажировка'
           WHEN es.event_form = 'supervis_tren' THEN 'супервизия тренеров'
           WHEN es.event_form = 'training' THEN 'тренинг'
           WHEN es.event_form = 'webinar' THEN 'вебинар'
           ELSE ''
           END AS event_form,
       tls.lector_fio,
       e.data.value('(//custom_elems/custom_elem[name=''nps'']/value)[1]', 'varchar(max)') AS nps,
       cests.name AS status_name,
       tps.preparation_fio,
       IIF(ers.is_assist = 'false', 0, row_number() over(partition BY cs.code, '_', cs.fullname ORDER BY cs.fullname, os.name, ers.not_participate, es.finish_date)) AS num,
       DAY(es.finish_date) AS day,
       MONTH(es.finish_date) AS month,
       YEAR(es.finish_date) AS year,
       ers.id AS event_result_id,
       erts.name AS result_type_name,
       IIF(e_cont.id IS NOT NULL , e_cont.id, er_cont.id) AS contract_id,
       IIF(e_cont.id IS NOT NULL , e_cont.number, er_cont.number) AS contract_number,
       IIF(e_cont.id IS NOT NULL , e_cont.date, er_cont.date) AS contract_date,
       ers.event_start_date
FROM [WTDB].[dbo].event_results AS ers
         INNER JOIN [WTDB].[dbo].event_result AS er ON ers.id = er.id
         INNER JOIN [WTDB].[dbo].events AS es ON ers.event_id = es.id AND es.education_org_id IN (6938000483356197646, 6938001238782589341, 6869760264243199229, 6148914691236517202, 7034790057599700358, 7100351150313827874)
         INNER JOIN [WTDB].[dbo].event AS e ON es.id = e.id
         INNER JOIN [WTDB].[dbo].event_result_types AS erts ON ers.event_result_type_id = erts.id
         LEFT JOIN [WTDB].[dbo].education_methods AS ems ON es.education_method_id = ems.id
         INNER JOIN [WTDB].[dbo].education_method AS em ON ems.id = em.id
         INNER JOIN [WTDB].[dbo].collaborators AS cs ON ers.person_id = cs.id-- AND cs.id = 7351734047845980789
         INNER JOIN [WTDB].[dbo].collaborator AS c ON cs.id = c.id
         LEFT JOIN [WTDB].[dbo].positions AS ps ON cs.position_id = ps.id
         INNER JOIN [WTDB].[dbo].orgs AS os ON cs.org_id = os.id
         INNER JOIN [WTDB].[dbo].org AS o ON os.id = o.id
         INNER JOIN [WTDB].[dbo].regions AS rs ON os.region_id = rs.id
         INNER JOIN [WTDB].[dbo].regions AS f_rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = f_rs.id
         LEFT JOIN _temp_lectors AS tls ON e.id = tls.id
         LEFT JOIN _temp_preparations AS tps ON e.id = tps.id
         INNER JOIN [WTDB].[dbo].[common.event_status_types] AS cests ON es.status_id = cests.id
         LEFT JOIN [WTDB].[dbo].contracts AS e_cont ON e.data.value('(event/contract_id)[1]', 'bigint') = e_cont.id
         LEFT JOIN [WTDB].[dbo].contracts AS er_cont ON er.data.value('(//custom_elems/custom_elem[name=''contract'']/value)[1]', 'bigint') = er_cont.id
WHERE ers.event_result_type_id IN (7382910824673783016, 7163559108516859483, 7101360067944455608, 7101359258024498877)
ORDER BY cs.fullname, os.name, es.finish_date;

DROP TABLE _temp_lectors;
DROP TABLE _temp_preparations;
