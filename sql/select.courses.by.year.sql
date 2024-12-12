WITH _view AS (SELECT course_id, YEAR(start_learning_date) AS year, COUNT(*) as cnt
               FROM [WTDB].[dbo].learnings
               WHERE state_id > 0
                 AND start_learning_date IS NOT NULL
               GROUP BY course_id, YEAR(start_learning_date)
               UNION
               SELECT course_id, YEAR(start_learning_date) AS year, COUNT(*) as cnt
               FROM [WTDB].[dbo].active_learnings
               WHERE state_id > 0
                 AND start_learning_date IS NOT NULL
               GROUP BY course_id, YEAR(start_learning_date)
)
SELECT course_id,
       year,
       SUM(cnt) AS cnt,
       SUM(CASE WHEN year = 2019 THEN cnt ELSE 0 END) AS year19,
       SUM(CASE WHEN year = 2020 THEN cnt ELSE 0 END) AS year20,
       SUM(CASE WHEN year = 2021 THEN cnt ELSE 0 END) AS year21,
       SUM(CASE WHEN year = 2022 THEN cnt ELSE 0 END) AS year22,
       SUM(CASE WHEN year = 2023 THEN cnt ELSE 0 END) AS year23,
       SUM(CASE WHEN year = 2024 THEN cnt ELSE 0 END) AS year24
INTO _tbl
FROM _view
GROUP BY course_id, year
ORDER BY course_id, year;

SELECT cs.id,
       cs.code,
       cs.name,
       c.data.value('(//custom_elems/custom_elem[name=''expluatation_date'']/value)[1]', 'varchar(max)') AS expluatation_date,
       _tbl.year19,
       _tbl.year20,
       _tbl.year21,
       _tbl.year22,
       _tbl.year23,
       _tbl.year24
INTO _tbl1
FROM _tbl
         INNER JOIN [WTDB].[dbo].courses cs ON _tbl.course_id = cs.id
         INNER JOIN [WTDB].[dbo].course c ON cs.id = c.id
WHERE cs.code LIKE '%FCK-%' AND NOT cs.code LIKE '%-FCK-%'
ORDER BY cs.id, _tbl.year;

SELECT id,
       code,
       name,
       expluatation_date,
       SUM(year19) AS year19,
       SUM(year20) AS year20,
       SUM(year21) AS year21,
       SUM(year22) AS year22,
       SUM(year23) AS year23,
       SUM(year24) AS year24
FROM _tbl1
GROUP BY id, code, name, expluatation_date;

DROP TABLE _tbl; DROP TABLE _tbl1;

