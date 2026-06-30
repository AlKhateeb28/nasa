SELECT id,
    position_parent_id
FROM [WTDB].[dbo].collaborators
WHERE id = 6940257832121737591

UPDATE [WTDB].[dbo].collaborators SET position_parent_id = NULL WHERE id = 6940257832121737591

SELECT id,
    parent_object_id
FROM [WTDB].[dbo].positions
WHERE id = 6940257831515080590

UPDATE [WTDB].[dbo].positions SET parent_object_id = NULL WHERE id = 6940257831515080590
