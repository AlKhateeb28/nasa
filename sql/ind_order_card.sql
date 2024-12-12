SET DATEFORMAT dmy;
SELECT
    group_collaborators.group_id AS group_id,
    g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_id''])[1]/value[1]', 'varchar(max)') AS ind_card_id,
    g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_start_date''])[1]/value[1]', 'date') AS start,
    g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_finish_date''])[1]/value[1]', 'date') AS finish,
    g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_id''])[1]/value[1]', 'varchar(max)') AS ind_order_card_id
FROM group_collaborators
         LEFT JOIN [WTDB].[dbo].[group] g ON g.id = group_collaborators.group_id
WHERE group_collaborators.collaborator_id = 7418495765598792402
  AND g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_id''])[1]/value[1]', 'varchar(max)') IS NOT NULL
  AND GETDATE() BETWEEN g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_start_date''])[1]/value[1]', 'date') AND g.data.value('(group/custom_elems/custom_elem[name=''ind_order_card_finish_date''])[1]/value[1]', 'date')

SELECT *
FROM [WTDB].[dbo].cc_ind_order_cards
WHERE GETDATE() < finish_date
  AND (status IS NULL OR UPPER(status) = 'ЗАКАЗ НА ИСПОЛНЕНИИ')
  AND id = 7239335775261625205