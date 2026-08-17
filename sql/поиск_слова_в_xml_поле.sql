DECLARE @sql NVARCHAR(MAX) = N'';

SELECT @sql = @sql +
    'SELECT ''' + TABLE_SCHEMA + '.' + TABLE_NAME + ''' AS TableName, ' +
    'COUNT(*) AS MatchCount ' +
    'FROM [' + TABLE_SCHEMA + '].[' + TABLE_NAME + '] ' +
    'WHERE CAST(data AS XML).exist(''//*[contains(string(.), "xyz_zyx")]'') = 1 ' +
    'UNION ALL '
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME = 'data'
    AND DATA_TYPE = 'xml';

-- Удаляем последний UNION ALL
IF LEN(@sql) > 0
    SET @sql = LEFT(@sql, LEN(@sql) - 10);
-- Убираем последний 'UNION ALL'

SET @sql = '
SELECT TableName, MatchCount
FROM (
    ' + @sql + '
) AS Results
WHERE MatchCount > 0
ORDER BY MatchCount DESC;
';

-- Выполняем собранный запрос
EXEC sp_executesql @sql;