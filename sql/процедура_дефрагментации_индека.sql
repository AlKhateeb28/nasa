DECLARE @TableName NVARCHAR(MAX);
SET @TableName = '_white_gray_ids';

DECLARE @TableIndexName NVARCHAR(MAX);
SET @TableIndexName = 'PK___white_g__3213E83F13D91142';

DECLARE @DefragValue INT;
SET @DefragValue  = 5;


--SET NOCOUNT ON

SET LOCK_TIMEOUT 5000;

DECLARE @Sql NVARCHAR(MAX);

BEGIN TRANSACTION
BEGIN TRY
        SET @Sql = N'SELECT * FROM [WTDB.[dbo].' + QUOTENAME(@TableName) + N' WITH (TABLOCKX, HOLDLOCK) WHERE 1 = 0';
        EXEC sp_executesql @Sql;

        DECLARE @DefragMode NVARCHAR(MAX);                    
		SET @DefragMode = '';
		
		IF @DefragValue >= 0 AND @DefragValue < 30
            SET @DefragMode = 'REORGANIZE';
        ELSE 
            SET @DefragMode = 'REBUILD';
			
		SET @Sql = N'ALTER INDEX ' + @TableIndexName + N' ON [WTDB].[dbo].' + QUOTENAME(@TableName) + ' ' + @DefragMode;
		--EXEC sp_executesql @Sql;
			
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
          
		SELECT ERROR_NUMBER();        
    END CATCH

SELECT 0;