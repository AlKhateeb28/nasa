SELECT cs.id,
       cs.org_id,
       c.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'varchar(max)') c_in_program,
       c.data.value('(//doc_info/creation)[1]/date[1]', 'varchar(max)') created_date,
       cs.modification_date
FROM collaborators cs
         INNER JOIN collaborator c on cs.id = c.id
WHERE cs.org_id = 6852958430721166518
  AND c.data.exist('(//custom_elems/custom_elem[name=''in_program''])') = 0
ORDER BY cs.modification_date DESC