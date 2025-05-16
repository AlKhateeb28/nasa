SELECT an.data.value('(//recipients/recipient/address)[1]', 'varchar(max)') AS address
FROM [WTDB].[dbo].active_notification an
WHERE an.data.value('(//status)[1]', 'varchar(max)') = 'sent'
  AND an.data.value('(//recipients/recipient/address)[1]', 'varchar(max)') IS NOT NULL
  AND DAY(an.data.value('(//send_date)[1]', 'varchar(max)')) = 15
  AND MONTH(an.data.value('(//send_date)[1]', 'varchar(max)')) = 5
  AND YEAR(an.data.value('(//send_date)[1]', 'varchar(max)')) = 2025