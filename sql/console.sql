SELECT
    COLUMN_NAME AS name,
    DATA_TYPE AS type,
    CAST(CHARACTER_MAXIMUM_LENGTH AS VARCHAR) AS length
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'orgs'
ORDER BY ORDINAL_POSITION;


--SELECT MAX(LEN(COLUMN_NAME)) AS max_len FROM [WTDB].[dbo].orgs

SELECT oe.id,
        oe.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') in_program,
        oe.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'nvarchar(1)') format_part,
        oe.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') is_rck,
        oe.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') is_roiv,
        oe.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') is_partner,
        oe.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') is_project_ended
FROM orgs o
    JOIN org oe ON o.id = oe.id
WHERE  o.id = 6852955835247913305
--o.modification_date > DATEADD(MINUTE, -10, GETDATE())

SELECT id, name
FROM orgs
WHERE name LIKE N'%МЕТРОПОЛИТЕН%'

select cs.org_id,
    MAX(os.name) AS name,
    COUNT(cs.org_id) AS count
from collaborators cs 
    inner join orgs os on cs.org_id = os.id
group by cs.org_id
order by count desc

SELECT os.id,
    cs.id AS person_id,
    o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') AS in_program,
    o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'nvarchar(1)') AS is_fcc,
    o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS is_rck,
    o.data.value('(//custom_elems/custom_elem[name=''is_ock'']/value)[1]', 'bit') AS is_ock,
    o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS is_roiv,
    o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS is_partner,
    o.data.value('(//custom_elems/custom_elem[name=''is_a_commerce_client'']/value)[1]', 'bit') AS is_commerce,
    o.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') AS is_project_ended,
    o.data.value('(//custom_elems/custom_elem[name=''With_no_right'']/value)[1]', 'bit') AS with_no_right
FROM collaborators cs
    INNER JOIN orgs os ON cs.org_id = os.id
    INNER JOIN org o ON os.id = o.id
WHERE cs.modification_date > DATEADD(MINUTE, -15, GETDATE())