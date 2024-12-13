SELECT al.course_id, c.name, COUNT(*) as cnt1
INTO TableAA_1
FROM [WTDB].[dbo].active_learnings al
         INNER JOIN [WTDB].[dbo].courses c ON al.course_id = c.id AND c.code LIKE '%FCK%'
WHERE al.state_id = 1
--AND c.id IN (6743171439274387218, 6947617168468299331, 7237421479525697953, 6671106418291659865, 6945089176400581058, 6947584845511328020, 7337677560566596135, 7364330214900518463)
GROUP BY al.course_id, c.name

SELECT al.course_id, c.name, COUNT(*) as cnt2
INTO TableAA_2
FROM [WTDB].[dbo].active_learnings al
         INNER JOIN [WTDB].[dbo].courses c ON al.course_id = c.id AND c.code LIKE '%FCK%'
WHERE al.state_id = 0
--AND c.id IN (6743171439274387218, 6947617168468299331, 7237421479525697953, 6671106418291659865, 6945089176400581058, 6947584845511328020, 7337677560566596135, 7364330214900518463)
GROUP BY al.course_id, c.name




SELECT c.name, SUM(tbl1.cnt1) AS cnt1, SUM(tbl2.cnt2) AS cnt2
FROM [WTDB].[dbo].courses c
         INNER JOIN TableAA_1 tbl1 ON c.id = tbl1.course_id
         INNER JOIN TableAA_2 tbl2 ON c.id = tbl2.course_id
GROUP BY c.name
DROP TABLE TableAA_1; DROP TABLE TableAA_2