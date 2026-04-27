SELECT dbs.name,
		sqltext.TEXT,
		req.*
FROM sys.dm_exec_requests req
	CROSS APPLY sys.dm_exec_sql_text(sql_handle) AS sqltext
	INNER JOIN sys.databases dbs on dbs.database_id=req.database_id
ORDER BY cpu_time DESC

SELECT r.session_id, 
		r.status, 
		t.text
FROM sys.dm_exec_requests r
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE r.status = 'suspended';
