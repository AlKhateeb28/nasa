ALTER TABLE [WTDB].[dbo].orgs ADD inprogram INT NULL;

UPDATE [WTDB].[dbo].orgs SET inprogram = 0 WHERE inprogram IS NULL;

ALTER TABLE [WTDB].[dbo].orgs ADD CONSTRAINT DF_orgs_inprogram DEFAULT 0 FOR inprogram;
ALTER TABLE [WTDB].[dbo].orgs ALTER COLUMN inprogram INT NULL;

UPDATE os SET os.inprogram = CASE 
		WHEN o.data.value('(//custom_elem[name=''in_program'']/value)[1]', 'VARCHAR(10)') = 'true' THEN 1
		WHEN o.data.value('(//custom_elem[name=''in_program'']/value)[1]', 'VARCHAR(10)') = 'false' THEN 0
		ELSE 0
	END
FROM [WTDB].[dbo].orgs os
    INNER JOIN [WTDB].[dbo].org o ON os.id = o.id;

CREATE NONCLUSTERED INDEX IDX_orgs_inprogram ON [WTDB].[dbo].orgs (inprogram) WITH (FILLFACTOR = 90);

CREATE TRIGGER [dbo].trg_org_inprogram ON orgs AFTER INSERT, UPDATE
	AS
		BEGIN
    SET NOCOUNT ON;

    UPDATE os
			SET os.inprogram = 0
			FROM [WTDB].[dbo].orgs os
        INNER JOIN [WTDB].[dbo].org o ON os.id = o.id
        INNER JOIN inserted i ON os.id = i.id
			WHERE os.inprogram IS NULL;

    UPDATE os
			SET os.inprogram = 0
			FROM [WTDB].[dbo].orgs os
        INNER JOIN [WTDB].[dbo].org o ON os.id = o.id
        INNER JOIN inserted i ON os.id = i.id
			WHERE o.data.exist('//custom_elem[name="in_program"]') = 0;

    UPDATE os
			SET os.inprogram = CASE 
				WHEN o.data.value('(//custom_elem[name="in_program"]/value)[1]', 'VARCHAR(10)') = 'true' THEN 1
				WHEN o.data.value('(//custom_elem[name="in_program"]/value)[1]', 'VARCHAR(10)') = 'false' THEN 0
				ELSE 0
			END
			FROM [WTDB].[dbo].orgs os
        INNER JOIN [WTDB].[dbo].org o ON os.id = o.id
        INNER JOIN inserted i ON os.id = i.id
			WHERE o.data.exist('//custom_elem[name="in_program"]') = 1
END
GO