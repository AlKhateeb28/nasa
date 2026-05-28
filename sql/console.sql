SELECT CAST(ps.avg_fragmentation_in_percent AS DECIMAL(10,2)) AS frag,
    CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10,2)) AS size
FROM [WTDB].sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps
    JOIN [WTDB].sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
WHERE OBJECT_NAME (ps.object_id) = 'group_collaborators'
    AND i.name = 'idx_2037663410'

    SELECT TOP 50
    OBJECT_NAME(ps.object_id) AS table_name,
    i.name AS index_name,
    i.type_desc,
    ps.avg_fragmentation_in_percent,
    ps.page_count,
    CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10,2)) AS size_mb
FROM sys.dm_db_index_physical_stats (DB_ID(), NULL, NULL, NULL,'LIMITED') ps
    JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
WHERE ps.page_count > 1000
ORDER BY ps.avg_fragmentation_in_percent DESC, ps.page_count DESC;
