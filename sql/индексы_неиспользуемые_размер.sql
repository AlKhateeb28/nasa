SELECT
    SUM(CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10, 2))) AS size
FROM [WTDB].sys.dm_db_index_usage_stats s
    JOIN [WTDB].sys.indexes i ON s.object_id = i.object_id AND s.index_id = i.index_id
    JOIN [WTDB].sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps ON s.object_id = ps.object_id AND s.index_id = ps.index_id
WHERE s.database_id = DB_ID()
    AND i.type_desc IN ('NONCLUSTERED', 'CLUSTERED')
    AND OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1
    AND OBJECT_NAME(s.object_id) NOT LIKE '(%'
    AND s.user_seeks = 0
    AND s.user_lookups = 0
