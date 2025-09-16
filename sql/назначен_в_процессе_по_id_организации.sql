-- КОЛИЧЕСТВОВО КУРСОВ СО СТАТУСОМ "НАЗНАЧЕН" И "В ПРОЦЕССЕ" ПО ID ОРГАНИЗАЦИИ
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