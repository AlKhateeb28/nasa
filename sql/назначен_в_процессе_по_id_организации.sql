-- КОЛИЧЕСТВОВО КУРСОВ СО СТАТУСОМ "НАЗНАЧЕН" И "В ПРОЦЕССЕ" ПО ID ОРГАНИЗАЦИИ
SELECT COUNT(als.id)
FROM [WTDB].[dbo].active_learnings als
         INNER JOIN [WTDB].[dbo].collaborators cs ON als.person_id = cs.id AND cs.org_id = 7143561677049417815
WHERE als.state_id = 0
   OR als.state_id = 1