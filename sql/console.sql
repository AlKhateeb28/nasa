SELECT ls.id,
   ls.person_fullname,
   ls.person_id,
   ls.is_dismiss,
   l.data.value('(//custom_elems/custom_elem[name=''lector_status_code_vp''])[1]/value[1]', 'varchar') AS status
FROM [WTDB].[dbo].cc_permission_run_programs_fcks prps
   INNER JOIN [WTDB].[dbo].lector l 
      ON prps.education_method_id = l.data.value('(//custom_elems/custom_elem[name=''education_method_vp''])[1]/value[1]', 'bigint')
         AND l.data.value('(//custom_elems/custom_elem[name=''lector_status_code_vp''])[1]/value[1]', 'varchar') IS NOT NULL
   INNER JOIN [WTDB].[dbo].lectors ls ON l.id = ls.id       
WHERE prps.id = 7305579116661541777
   AND l.id = 7173578051093396426
