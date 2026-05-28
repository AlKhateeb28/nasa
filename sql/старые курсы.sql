SELECT als.id,
    als.person_id,
    cs.code
FROM [WTDB].[dbo].active_learnings als
    INNER JOIN [WTDB].[dbo].courses cs ON als.course_id = cs.id AND cs.id IN(6644416288763437283, 7163358046210946136) -- старые курсы
--WHERE als.person_id = 7298666878712639207
	--INNER JOIN [WTDB].[dbo].courses cs ON als.course_id = cs.id AND cs.id IN(7258899558722533245, 7263814027616881043) -- новые курсы FCK-001 PROMO-FCK-001