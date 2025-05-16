SELECT os.id, MAX(LEN(os.name)) AS len, MAX(os.name) AS name
FROM [WTDB].[dbo].orgs AS os
    INNER JOIN [WTDB].[dbo].org AS o ON os.id = o.id
WHERE o.data.value('(org/custom_elems/custom_elem[name=''format_part''])[1]/value[1]', 'varchar(max)') = 'rcc'
GROUP BY os.id
ORDER BY len DESC
