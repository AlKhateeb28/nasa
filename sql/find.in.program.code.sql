-- remote_actions
select ra.data,
       ras.*
from [WTDB].[dbo].remote_actions ras
         inner join [WTDB].[dbo].remote_action ra ON ras.id = ra.id
where ra.data.value('(remote_action/script)[1]', 'varchar(max)') like '%Сертификат%'

-- agents
select sa.data.value('(server_agent/run_code)[1]', 'varchar(max)'),
       sa.data,
       sas.*
from [WTDB].[dbo].server_agents sas
         inner join [WTDB].[dbo].server_agent sa ON sas.id = sa.id
where sa.data.value('(server_agent/run_code)[1]', 'varchar(max)') like '%getMismatchWebsocketClient()%'