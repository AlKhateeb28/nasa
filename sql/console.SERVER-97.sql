SELECT ls.*
 FROM [WTDB].[dbo].active_learnings AS ls
   INNER JOIN [WTDB].[dbo].active_learning AS l ON ls.id = l.id
   INNER JOIN [WTDB].[dbo].courses AS cs ON ls.course_id = cs.id AND cs.code LIKE '%FCK-%'
 WHERE ls.state_id = 0
   AND YEAR(ls.start_usage_date) = 2025
   AND DATEPART(week, ls.start_usage_date) = 51
   AND ls.id = 7232538594004958495
   

--SELECT * FROM [WTDB].[dbo].active_learnings WHERE id = 7232538599642520794

UPDATE [WTDB].[dbo].active_learnings SET overflow = 1 WHERE id = 7232538594004958495