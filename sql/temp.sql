/*SET DATEFORMAT dmy;
DECLARE @date_from datetime = '01.01.2019 00:00:00';
DECLARE @date_to datetime = '31.12.2024 23:59:59';*/

WITH tmp AS (
    SELECT events.id AS e_id, lectors.lector_fullname AS lec_fio
    FROM [WTDB].[dbo].events
             INNER JOIN [WTDB].[dbo].event e ON events.id = e.id
             CROSS APPLY e.data.nodes('event/lectors/lector') T(c)
             INNER JOIN [WTDB].[dbo].lectors
                        ON T.c.value('lector_id[1]','varchar(max)') = lectors.id
)
SELECT e_id, lec_fio_s = STUFF (
        (
            SELECT '|' + lec_fio
            FROM tmp tmp1
            WHERE tmp1.e_id = tmp.e_id
            FOR XML PATH ('')
        )
    , 1, 1, ''
                         )
FROM tmp
WHERE e_id = 7411433821604300143
GROUP BY e_id

/*SELECT lec_fio_s = STUFF (
        (
            SELECT '|' + lec_fio
            FROM (
                     SELECT ev1.id AS e_id, lectors.lector_fullname AS lec_fio
                     FROM [WTDB].[dbo].events ev1
                              INNER JOIN [WTDB].[dbo].event e1 ON ev1.id = e1.id
                              CROSS APPLY e1.data.nodes('event/lectors/lector') T(c)
                              INNER JOIN [WTDB].[dbo].lectors
                                         ON T.c.value('lector_id[1]','varchar(max)') = lectors.id
                     --WHERE ev1.finish_date BETWEEN @date_from AND @date_to
                 ) tt2
            WHERE tt2.e_id = 6992923133104848806
            FOR XML PATH ('')
        ), 1, 1, '')*/
