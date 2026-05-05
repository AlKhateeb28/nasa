USE [WTDB];  -- например, USE MyDatabase;
GO

SELECT OBJECT_NAME(ps.object_id) AS table_name,
    i.name AS index_name,
	i.type_desc AS index_type,
    STUFF((
        SELECT ', ' + COL_NAME(ic.object_id, ic.column_id)
        FROM sys.index_columns ic
        WHERE ic.object_id = ps.object_id 
          AND ic.index_id = ps.index_id
          AND ic.is_included_column = 0
        ORDER BY ic.key_ordinal
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS index_keys,
    CAST(ps.avg_fragmentation_in_percent AS DECIMAL(10,2)) AS avg_fragmentation,
    CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10,2)) AS size_MB
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps
JOIN sys.indexes i 
    ON ps.object_id = i.object_id 
    AND ps.index_id = i.index_id
WHERE ps.avg_fragmentation_in_percent > 5
  AND ps.page_count > 1000
  AND OBJECT_NAME(ps.object_id) NOT LIKE '(%'
ORDER BY table_name, ps.avg_fragmentation_in_percent DESC;