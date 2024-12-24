SET DATEFORMAT dmy
DECLARE @date_from datetime = '01.01.2019 00:00:00';
DECLARE @date_to datetime = '31.12.2025 23:59:59';

SELECT lec_fio_s = STUFF (
                           (
                               SELECT '|' + lec_fio
                               FROM (
                                        SELECT ev1.id AS e_id, lectors.lector_fullname AS lec_fio
                                        FROM [WTDB].[dbo].events ev1
                                                 INNER JOIN [WTDB].[dbo].event e1 ON ev1.id = e1.id
                                                 CROSS APPLY e1.data.nodes('event/lectors/lector') T(c)
                                                 INNER JOIN [WTDB].[dbo].lectors
                                                            ON T.c.value('lector_id[1]','varchar(max)') = lectors.id
                                    ) tt2
                               WHERE tt2.e_id = events.id
                               FOR XML PATH ('')
                           ), 1, 1, ''),
       pre_fio_s = STUFF (
                           (
                               SELECT '|' + pre_fio
                               FROM (
                                        SELECT ev1.id AS e_id, T.c.value('person_fullname[1]','varchar(max)') AS pre_fio
                                        FROM [WTDB].[dbo].events ev1
                                                 INNER JOIN [WTDB].[dbo].event e1 ON ev1.id = e1.id
                                                 CROSS APPLY e1.data.nodes('event/even_preparations/even_preparation') T(c)
                                    ) tt2
                               WHERE tt2.e_id = events.id
                               FOR XML PATH ('')
                           ), 1, 1, ''),
                   events.id,
                   CONCAT( '''', event_results.id ) AS PK,
                   event_results.is_assist,
                   event_results.not_participate,
                   event_result_types.name AS event_result_type,
                   events.finish_date AS f_date,
                   YEAR(events.finish_date) AS f_date_year,
                   MONTH(events.finish_date) AS f_date_month,
                   DAY(events.finish_date) AS f_date_day,
                   CONCAT( '''', events.id ) AS e_id,
                   events.name AS e_name,
                   collaborators.code AS col_code,
                   collaborators.fullname AS col_fullname,
                   places.name AS place_name,
                   [common.event_status_types].name AS status_name,
                   education_methods.name AS edu_meth_name,
                   CONCAT( '''', education_methods.id  ) AS edu_meth_id,
                   events.education_org_name AS edu_org_name,
                   event.data.value('(event/custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps,
                   event.data.value('(event/custom_elems/custom_elem[name=''month_otch''])[1]/value[1]', 'varchar(max)') AS month_otch,
                   CONCAT( '''', orgs.code ) AS o_inn,
                   orgs.name AS o_name,
                   org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part,
                   CASE
                       WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                       ELSE '-'
                       END AS is_rck,
                   CASE
                       WHEN org.data.value('(org/custom_elems/custom_elem[name=''is_roiv''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                       ELSE '-'
                       END AS is_roiv,
                   CASE
                       WHEN org.data.value('(org/custom_elems/custom_elem[name=''be_in_sr''])[1]/value[1]', 'varchar(max)') = 'true' THEN '+'
                       ELSE '-'
                       END AS be_in_sr,
                   ( SELECT regions.name FROM [WTDB].[dbo].regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') ) AS fact_reg_name,
                   regions.name AS reg_name,
                   collaborator.data.value('(collaborator/lastname)[1]', 'varchar(max)') AS col_lastname,
                   collaborator.data.value('(collaborator/firstname)[1]', 'varchar(max)') AS col_firstname,
                   collaborator.data.value('(collaborator/middlename)[1]', 'varchar(max)') AS col_middlename,
                   CONCAT( '''', orgs.code, '_', orgs.name ) AS o_inn_name,
                   CONCAT( collaborators.code, '_', collaborators.fullname ) AS col_code_fullname,
                   CASE
                       WHEN event_results.is_assist = 'false' THEN 0
                       ELSE row_number() over(partition BY collaborators.code, '_', collaborators.fullname
                           ORDER BY collaborators.fullname, orgs.name, event_results.not_participate,
                               events.finish_date)
                       END AS num,
                   CASE
                       WHEN events.event_form = 'conference' THEN 'конференция'
                       WHEN events.event_form = 'examination' THEN 'сертификация'
                       WHEN events.event_form = 'game' THEN 'деловая игра'
                       WHEN events.event_form = 'meeting' THEN 'стартовое совещание'
                       WHEN events.event_form = 'meth_day' THEN 'методический день'
                       WHEN events.event_form = 'pered_prog' THEN 'передача программ'
                       WHEN events.event_form = 'praktikum' THEN 'тренинг-площадка'
                       WHEN events.event_form = 'scan' THEN 'сканирование'
                       WHEN events.event_form = 'seminar' THEN 'семинар'
                       WHEN events.event_form = 'stagirovka' THEN 'стажировка'
                       WHEN events.event_form = 'supervis_tren' THEN 'супервизия тренеров'
                       WHEN events.event_form = 'training' THEN 'тренинг'
                       WHEN events.event_form = 'webinar' THEN 'вебинар'
                       ELSE ''
                       END AS event_form
        , positions.name AS pos_name
        , event_result.data.value('(event_result/custom_elems/custom_elem[name=''event_guid''])[1]/value[1]', 'varchar(max)') AS event_guid
        , event_result.data.value('(event_result/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS er_guid
        , collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS col_guid,
                   collaborators.id AS colls_id
FROM [WTDB].[dbo].event_results
         INNER JOIN [WTDB].[dbo].event_result ON event_results.id = event_result.id
         INNER JOIN [WTDB].[dbo].collaborators ON event_results.person_id = collaborators.id AND collaborators.code NOT LIKE '%tren_muc%'
         INNER JOIN [WTDB].[dbo].collaborator ON event_results.person_id = collaborator.id
         INNER JOIN [WTDB].[dbo].events ON event_results.event_id = events.id /*AND events.code LIKE '%week%'*/ AND events.finish_date BETWEEN @date_from AND @date_to
         INNER JOIN [WTDB].[dbo].event ON event_results.event_id = event.id
         LEFT JOIN [WTDB].[dbo].event_result_types ON event_results.event_result_type_id = event_result_types.id
         LEFT JOIN [WTDB].[dbo].places ON events.place_id = places.id
         INNER JOIN [WTDB].[dbo].[common.event_status_types] ON events.status_id = [common.event_status_types].id
         LEFT JOIN [WTDB].[dbo].education_methods ON events.education_method_id = education_methods.id
         INNER JOIN [WTDB].[dbo].orgs ON collaborators.org_id = orgs.id
         INNER JOIN [WTDB].[dbo].org ON collaborators.org_id = org.id
         INNER JOIN [WTDB].[dbo].regions ON regions.id = orgs.region_id
         LEFT JOIN [WTDB].[dbo].positions ON positions.id = collaborators.position_id
ORDER BY lec_fio_s DESC

--DROP TABLE #Table1; DROP TABLE #Table2;