SET DATEFORMAT dmy; DECLARE @date_from datetime = '01.01.2010 00:00:00'; DECLARE @date_to datetime = '31.12.2030 23:59:59';
WITH TempTable1 AS (
    SELECT events.id AS e_id, T.c.value('person_fullname[1]','varchar(max)') AS tutor_fio
    FROM [WTDB].[dbo].events
             LEFT JOIN [WTDB].[dbo].event e ON events.id = e.id
             CROSS APPLY e.data.nodes('event/tutors/tutor') T(c)
    WHERE events.finish_date BETWEEN @date_from AND @date_to
)
SELECT e_id, tutor_fio_s = STUFF (
        (
            SELECT '|' + tutor_fio
            FROM TempTable1 tt2
            WHERE tt2.e_id = tt1.e_id
            FOR XML PATH ('')
        )
    , 1, 1, ''
                           )
INTO #Table1
FROM TempTable1 tt1
GROUP BY e_id;
WITH TempTable2 AS (
    SELECT events.id AS e_id, T.c.value('person_fullname[1]','varchar(max)') AS pre_fio
    FROM [WTDB].[dbo].events
             LEFT JOIN [WTDB].[dbo].event e ON events.id = e.id
             CROSS APPLY e.data.nodes('event/even_preparations/even_preparation') T(c)
    WHERE events.finish_date BETWEEN @date_from AND @date_to)
SELECT e_id, pre_fio_s = STUFF (
        (
            SELECT '|' + pre_fio
            FROM TempTable2 tt2
            WHERE tt2.e_id = tt1.e_id
            FOR XML PATH ('')
        )
    , 1, 1, '')
INTO #Table2
FROM TempTable2 tt1
GROUP BY e_id;
SELECT top 1000000
    CONCAT( '''', event_results.id ) AS PK,
    event_results.is_assist,
    event_results.not_participate,
    events.finish_date AS f_date,
    YEAR(events.finish_date) AS f_date_year,
    MONTH(events.finish_date) AS f_date_month,
    DAY(events.finish_date) AS f_date_day,
    CONCAT( '''', events.id ) AS e_id,
    CONCAT( events.name, '_', events.id ) AS e_name_id,
    events.code AS e_code,
    events.name AS e_name,
    event_types.name AS e_type_name,
    collaborators.code AS col_code,
    collaborators.fullname AS col_fullname,
    places.name AS place_name,
    [common.event_status_types].name AS status_name,
    education_methods.name AS edu_meth_name,
    events.education_org_name AS edu_org_name,
    #Table1.tutor_fio_s AS tutor_fio_s,
    #Table2.pre_fio_s AS pre_fio_s,
    event.data.value('(event/custom_elems/custom_elem[name=''nps''])[1]/value[1]', 'varchar(max)') AS nps,
    CONCAT( '''', orgs.code ) AS o_inn,
    orgs.name AS o_name,
    org.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') AS format_part,
    org.data.value('(org/custom_elems/custom_elem[name=''is_rck''])[1]/value[1]', 'varchar(max)') AS is_rck,
    org.data.value('(org/custom_elems/custom_elem[name=''region_code''])[1]/value[1]', 'varchar(max)') AS reg_code,
    ( SELECT regions.name FROM [WTDB].[dbo].regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'varchar(max)') ) AS fact_reg_name,
    ( SELECT regions.name FROM [WTDB].[dbo].regions WHERE regions.id = org.data.value('(org/custom_elems/custom_elem[name=''report_region_id''])[1]/value[1]', 'varchar(max)') ) AS report_reg_name,
    regions.name AS reg_name,
    collaborator.data.value('(collaborator/lastname)[1]', 'varchar(max)') AS col_lastname,
    collaborator.data.value('(collaborator/firstname)[1]', 'varchar(max)') AS col_firstname,
    collaborator.data.value('(collaborator/middlename)[1]', 'varchar(max)') AS col_middlename,
    CONCAT( collaborators.code, '_', collaborators.fullname ) AS col_code_fullname,
    CASE
        WHEN event_results.is_assist = 'false' THEN 0
        ELSE row_number() over( partition BY collaborators.code, '_', collaborators.fullname
            ORDER BY collaborators.fullname, orgs.name, event_results.not_participate, events.finish_date )
        END AS num,
    CONCAT( '''', orgs.code, '_', collaborators.fullname ) AS col_inn_fullname,
    CONCAT( '''', orgs.code, '_', orgs.name ) AS o_inn_name,
    CASEcount()
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
        , event_result.data.value('(event_result/custom_elems/custom_elem[name=''guid''])[1]/value[1]', 'varchar(max)') AS er_guid,
    evrts.name type_name,
    event_result.data.value('(event_result/custom_elems/custom_elem[name=''month_report''])[1]/value[1]', 'varchar(max)') AS month,
    event_result.data.value('(event_result/custom_elems/custom_elem[name=''year_report''])[1]/value[1]', 'varchar(max)') AS year,
    collaborator.data.value('(collaborator/custom_elems/custom_elem[name=''is_dossier_rcc_exist''])[1]/value[1]', 'varchar(max)') AS is_dossier_rcc_exist
FROM [WTDB].[dbo].event_results
         LEFT JOIN [WTDB].[dbo].event_result ON event_results.id = event_result.id
         LEFT JOIN [WTDB].[dbo].collaborators ON event_results.person_id = collaborators.id
         LEFT JOIN [WTDB].[dbo].collaborator ON event_results.person_id = collaborator.id
         LEFT JOIN [WTDB].[dbo].events ON event_results.event_id = events.id
         LEFT JOIN [WTDB].[dbo].event ON event_results.event_id = event.id
         LEFT JOIN [WTDB].[dbo].event_types	ON events.event_type_id = event_types.id
         LEFT JOIN [WTDB].[dbo].places ON events.place_id = places.id
         LEFT JOIN [WTDB].[dbo].[common.event_status_types] ON events.status_id = [common.event_status_types].id
         LEFT JOIN [WTDB].[dbo].education_methods ON events.education_method_id = education_methods.id
         LEFT JOIN #Table1	ON events.id = #Table1.e_id
         LEFT JOIN #Table2	ON events.id = #Table2.e_id
         LEFT JOIN [WTDB].[dbo].orgs ON collaborators.org_id = orgs.id
         LEFT JOIN [WTDB].[dbo].org	ON collaborators.org_id = org.id
         LEFT JOIN [WTDB].[dbo].regions ON orgs.region_id = regions.id
         LEFT JOIN [WTDB].[dbo].event_result_types AS evrts ON evrts.id = event_results.event_result_type_id
WHERE collaborators.code LIKE '%rck_muc%'
  AND events.finish_date BETWEEN @date_from AND @date_to
ORDER BY col_fullname, o_name, not_participate, f_date; DROP TABLE #Table1;  DROP TABLE #Table2;