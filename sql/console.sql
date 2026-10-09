/*SELECT kvns.*,
    cs.fullname
FROM [WTDB].[dbo].cc_kvns kvns
    INNER JOIN collaborators cs ON kvns.person_id = cs.id
ORDER BY kvns.modification_date DESC*/
SELECT TOP 10 *
    FROM (SELECT * FROM
            (SELECT lms.id, lm.data.value('(library_material/name)[1]', 'varchar(max)') name,
                    lm.data.value('(library_material/image)[1]', 'varchar(max)') img_id,
                    lm.data.value('(library_material/author)[1]', 'varchar(max)') autor,
                    k.lm.query('.').value('.', 'bigint') as knowledge_part_id
            FROM  lms
                    INNER JOIN library_material lm ON lms.id = lm.id
                    CROSS APPLY lm.data.nodes('library_material/knowledge_parts/knowledge_part/knowledge_part_id') as k(lm)
            WHERE lms.external_id NOT LIKE '%mif%'
            ) lm 
        WHERE lm.knowledge_part_id = 6693394840926040015             
     ) books
   CROSS APPLY (SELECT COUNT(*) amnt_likes FROM likes lks WHERE lks.object_id = books.id ) X
   CROSS APPLY (SELECT COUNT(*) amnt_views FROM library_material_viewings lmvs WHERE lmvs.material_id = books.id) Y
   CROSS APPLY (SELECT COUNT(*) amnt_comments FROM blog_entry_comments becs WHERE becs.blog_entry_id = books.id ) Z
 ORDER BY X.amnt_likes DESC

SELECT author,
    [name],    
    SUBSTRING(external_id, 5, LEN(external_id)) AS mif_id,
    external_id,
    CAST(id AS VARCHAR(MAX)) AS id,
    resource_id
FROM [WTDB].[dbo].library_materials 
WHERE external_id NOT LIKE '%mif%'
        

SELECT TOP 10 ls.id,
        ls.creation_date,
        ls.modification_date
FROM [WTDB].[dbo].active_learnings ls
    INNER JOIN [WTDB].[dbo].active_learning l ON ls.id = l.id


SELECT ls.id,
   ls.person_id,
   ls.course_id,
   ls.creation_date,
   ls.modification_date,
   ls.start_usage_date,
   ls.start_learning_date,
   ls.last_usage_date,
   l.data.value('(//parts/part/start_usage_date)[1]', 'datetime') AS part_start_usage_date,
   l.data.value('(//parts/part/last_usage_date)[1]', 'datetime') AS part_last_usage_date,
   l.data.value('(//doc_info/creation/date)[1]', 'datetime') AS creation,
   l.data.value('(//doc_info/modification/date)[1]', 'datetime') AS modification,
   cs.max_score
 FROM [WTDB].[dbo].learnings AS ls
   INNER JOIN [WTDB].[dbo].learning AS l ON ls.id = l.id
   INNER JOIN [WTDB].[dbo].courses AS cs ON ls.course_id = cs.id AND cs.code LIKE '%FCK-%'
 WHERE ls.state_id = 1
   AND YEAR(ls.last_usage_date) = 2026
   AND MONTH(ls.last_usage_date) = 12
   AND DATEPART(week, ls.start_usage_date) < DATEPART(week, GETDATE())


/*SET DATEFORMAT dmy;
DECLARE @date datetime = '20.09.2026 23:59:59';*/
SELECT ls.id,    
    ls.start_usage_date,    
    ls.start_learning_date,
    ls.last_usage_date,    
    ls.gravy
FROM [WTDB].[dbo].learnings ls
WHERE ls.start_learning_date > ls.last_usage_date
    AND ls.person_id = 7302407891063862257


UPDATE [WTDB].[dbo].learnings SET start_learning_date = GETDATE() WHERE start_learning_date > last_usage_date AND person_id = 7302407891063862257

delete from [WTDB].[dbo].cc_web_activity