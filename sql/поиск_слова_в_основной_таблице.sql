DECLARE @searchValue NVARCHAR(100) = 'xyz_zyx';
DECLARE @sql NVARCHAR(MAX) = N'';
DECLARE @field NVARCHAR(100) = '';

-- Собираем все таблицы, где есть поле name
SELECT @sql = @sql +
    'SELECT ''' + TABLE_SCHEMA + '.' + TABLE_NAME + ''' AS TableName, ' +
    'COUNT(*) AS MatchCount ' +
    'FROM [' + TABLE_SCHEMA + '].[' + TABLE_NAME + '] ' +
    'WHERE ' + @field + ' = ''' + @searchValue + ''' ' +
    'UNION ALL '
FROM INFORMATION_SCHEMA.COLUMNS
WHERE COLUMN_NAME = @field;

-- Удаляем последний UNION ALL
IF LEN(@sql) > 0
    SET @sql = LEFT(@sql, LEN(@sql) - 10);
-- убираем последний 'UNION ALL'

SET @sql = '
SELECT TableName, MatchCount
FROM (
    ' + @sql + '
) AS Results
WHERE MatchCount > 0
ORDER BY MatchCount DESC;
';

-- Выполняем
EXEC sp_executesql @sql;