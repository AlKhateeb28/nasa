



SELECT cs.id,
       cs.modification_date,
       c.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'varchar(max)') c_in_program,
       o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'varchar(max)') o_in_program,
       c.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'varchar(max)') c_is_roiv,
       o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'varchar(max)') o_is_roiv,
       c.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'varchar(max)') c_is_partner,
       o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'varchar(max)') o_is_partner
FROM [WTDB].[dbo].collaborators cs
         INNER JOIN [WTDB].[dbo].collaborator c on cs.id = c.id
         INNER JOIN [WTDB].[dbo].orgs os on cs.org_id = os.id
         INNER JOIN [WTDB].[dbo].org o on os.id = o.id
WHERE cs.org_id = 6852958430721166518
  AND c.data.exist('(//custom_elems/custom_elem[name=''in_program''])') = 0
ORDER BY cs.modification_date