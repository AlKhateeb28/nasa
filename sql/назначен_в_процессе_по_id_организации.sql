-- КОЛИЧЕСТВОВО КУРСОВ СО СТАТУСОМ НАЗНАЧЕН И В ПРОЦЕССЕ ПО ID ОРГАНИЗАЦИИ
SELECT COUNT(als.id)
FROM [WTDB].[dbo].active_learnings als
         INNER JOIN [WTDB].[dbo].collaborators cs ON als.person_id = cs.id AND cs.org_id = 7164070365591646962
WHERE als.state_id = 0
   OR als.state_id = 1

SELECT als.start_usage_date,
       als.state_id,
       als.person_fullname,
       als.start_learning_date,
       als.last_usage_date,
       als.course_name,
       als.*
FROM [WTDB].[dbo].active_learnings als
         INNER JOIN [WTDB].[dbo].collaborators cs ON als.person_id = cs.id AND cs.org_id = 7164070365591646962
WHERE als.state_id = 0
   OR als.state_id = 1
ORDER BY als.person_fullname, als.start_usage_date, als.course_name

SELECT als.person_id,
       als.course_id,
       als.active_learning_id,
       als.last_usage_date
FROM [WTDB].[dbo].learnings als
WHERE als.id = 7169298784178828557 -- 6972374020663744668,6644416288763437283,7284122036960561501

SELECT als.person_id,
       als.course_id,
       als.active_learning_id,
       COUNT(*) AS count,
       MIN(als.last_usage_date) AS last_usage_date
FROM [WTDB].[dbo].learnings als
WHERE als.person_id = 6972374020663744668
GROUP BY als.person_id,
         als.course_id,
         als.active_learning_id
HAVING COUNT(*) > 1
ORDER BY last_usage_date

SELECT als.id,
       als.course_id,
       als.last_usage_date
FROM [WTDB].[dbo].learnings als
WHERE als.person_id = 6972374020663744668
  AND als.course_id = 6644416288763437283
  AND als.active_learning_id = 7284122036960561501
ORDER BY last_usage_date

