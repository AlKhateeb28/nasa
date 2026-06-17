SELECT
    OBJECT_NAME(i.object_id) AS table_name,
    i.name AS index_name,
    STUFF((     
		SELECT ', ' + COL_NAME(ic.object_id, ic.column_id)
    FROM sys.index_columns ic
    WHERE ic.object_id = s.object_id
        AND ic.index_id = s.index_id
        AND ic.is_included_column = 0
    FOR XML PATH(''), TYPE     
            ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS field_name,
    i.type_desc AS index_type,
    s.user_seeks AS seeks,
    s.user_scans AS scan,
    s.user_lookups AS lookups,
    s.user_seeks + s.user_scans + s.user_lookups AS total_reads,
    s.user_updates AS total_writes,
    CASE 
        WHEN (s.user_seeks + s.user_scans + s.user_lookups) = 0 THEN 'No reads'
        WHEN s.user_updates > (s.user_seeks + s.user_scans + s.user_lookups) THEN 'Writes > Reads'
        WHEN s.user_scans > s.user_seeks THEN 'Scans > Seeks'
        ELSE ''
    END AS status,
    CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10, 2)) AS size,
    s.last_user_seek,
    s.last_user_scan,
    s.last_user_lookup,
    s.last_user_update
FROM [WTDB].sys.dm_db_index_usage_stats s
    JOIN [WTDB].sys.indexes i ON s.object_id = i.object_id AND s.index_id = i.index_id
    JOIN [WTDB].sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps ON s.object_id = ps.object_id AND s.index_id = ps.index_id
WHERE s.database_id = DB_ID()
    AND i.type_desc IN ('NONCLUSTERED', 'CLUSTERED')
    AND OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1
    AND OBJECT_NAME(s.object_id) NOT LIKE '(%'
    AND s.user_seeks = 0
    AND s.user_lookups = 0
ORDER BY total_writes DESC, total_reads DESC;