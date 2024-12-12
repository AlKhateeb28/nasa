UPDATE [WTDB].[dbo].custom_web_template
SET data.modify('replace value of (/custom_web_template/is_std/text())[1] with "0"')
WHERE id = 6467098219746645555

------------------

SELECT e.data.value('(event/education_method_id)[1]', 'varchar(max)'),
       es.*
FROM [WTDB].[dbo].events es
         INNER JOIN [WTDB].[dbo].[event] e ON es.id = e.id
WHERE es.id = 7384503420322936662

UPDATE [WTDB].[dbo].[event]
SET data.modify(' replace value of (/event/education_method_id[1]/text())[1]
  with "6899302609423194943" ')
WHERE id = 7384503420322936662