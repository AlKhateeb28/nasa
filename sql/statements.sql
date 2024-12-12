WITH _view AS (SELECT ss.activity_code,
                      '' AS year,
                      lms.name,
                      CASE
                          WHEN lms.state_id = 0 THEN 'Проект'
                          WHEN lms.state_id = 1 THEN 'Действующий'
                          ELSE 'Архив'
                          END AS score,
                      ss.create_date AS start_date,
                      '' AS last_usage,
                      '' AS max_score,
                      '' AS serial,
                      '' AS number
               FROM [WTDB].[dbo].statements ss
                        LEFT JOIN [WTDB].[dbo].library_materials lms ON RIGHT(ss.activity_code, CHARINDEX('/', REVERSE(ss.activity_code) + '/') - 1) = lms.id
               WHERE ss.person_id = 7351734047845980789
                 AND UPPER(ss.verb_name) LIKE '%COMPLETED%'
)
SELECT DISTINCT activity_code, year, name, score, start_date, last_usage, max_score, serial, number
FROM _view
ORDER BY start_date