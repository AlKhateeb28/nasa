SELECT cs.id AS cs_id,
               os.id AS org_id,
               o.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'varchar(max)') AS format_part,
               IIF(o.data.exist('(//custom_elems/custom_elem[name=''format_part'']/value)[1]') = 0, 0, 1) AS format_part_exist,
               IIF(o.data.exist('(//custom_elems/custom_elem[name=''in_program''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') AS INT)) AS in_program,
               IIF(c.data.exist('(//custom_elems/custom_elem[name=''in_program''])') = 0, 0, 1)  AS in_program_exist,
               IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_fcc''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_fcc'']/value)[1]', 'bit') AS INT)) AS is_fcc,
               IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_fcc''])') = 0, 0, 1) AS is_fcc_exist,
               IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') AS INT)) AS is_rck,
               IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_rck''])') = 0, 0, 1) AS is_rck_exist,
               IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_roiv''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') AS INT)) AS is_roiv,
               IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_roiv''])') = 0, 0, 1) AS is_roiv_exist,
               IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_partner''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') AS INT)) AS is_partner,
               IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_partner''])') = 0, 0, 1) AS is_partner_exist,
               IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_a_commerce_client''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_a_commerce_client'']/value)[1]', 'bit') AS INT)) AS is_commerce,
               IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_a_commerce_client''])') = 0, 0, 1)  AS is_commerce_exist,
               IIF(o.data.exist('(//custom_elems/custom_elem[name=''is_project_ended''])') = 0, 0, CAST(o.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') AS INT)) AS is_project_ended,
               IIF(c.data.exist('(//custom_elems/custom_elem[name=''is_project_ended''])') = 0, 0, 1) AS is_project_ended_exist
         FROM [WTDB].[dbo].collaborators cs
                 INNER JOIN [WTDB].[dbo].collaborator c ON cs.id = c.id
                 INNER JOIN [WTDB].[dbo].orgs os ON cs.org_id = os.id
                 INNER JOIN [WTDB].[dbo].org o ON os.id = o.id
        -- WHERE cs.modification_date > DATEADD(MINUTE, -30, GETDATE())
         WHERE cs.id = 6870736682355282053


--UPDATE collaborator SET data.modify('replace value of (//custom_elems/custom_elem[name=''is_project_ended'']/value[1]/text())[1] with 1') WHERE id = 6870736682355282053;

UPDATE collaborator
SET data.modify('insert
                            <custom_elems>
                            </custom_elems>
                            as last into
                            (/collaborator)[1]
                ')
WHERE id = 6870736682355282053
    AND data.exist('//custom_elems') = 0;

UPDATE collaborator
SET data.modify('delete (//custom_elems/custom_elem[name=''in_program'' or name=''is_fcc'' or name=''is_rck'' or name=''is_roiv'' or name=''is_partner'' or name=''is_a_commerce_client'' or name=''is_project_ended''])')
WHERE id = 6870736682355282053;

WITH _view AS (
    SELECT id
    FROM collaborator
    WHERE id = 6870736682355282053
)
UPDATE collaborator
SET data.modify('insert
                            <custom_elem>
                                <name>in_program</name>
                                <value>0</value>
                            </custom_elem>
                            as last into
                            (//custom_elems)[1]
                ')
FROM collaborator c
    INNER JOIN _view _v ON c.id = _v.id;

UPDATE collaborator
SET data.modify('insert
                            <custom_elem>
                                <name>is_fcc</name>
                                <value>0</value>
                            </custom_elem>
                            as last into
                            (//custom_elems)[1]
                ')
WHERE id = 6870736682355282053;
UPDATE collaborator
SET data.modify('insert
                            <custom_elem>
                                <name>is_rck</name>
                                <value>1</value>
                            </custom_elem>
                            as last into
                            (//custom_elems)[1]
                ')
WHERE id = 6870736682355282053;
UPDATE collaborator
SET data.modify('insert
                            <custom_elem>
                                <name>is_roiv</name>
                                <value>1</value>
                            </custom_elem>
                            as last into
                            (//custom_elems)[1]
                ')
WHERE id = 6870736682355282053;
UPDATE collaborator
SET data.modify('insert
                            <custom_elem>
                                <name>is_partner</name>
                                <value>1</value>
                            </custom_elem>
                            as last into
                            (//custom_elems)[1]
                ')
WHERE id = 6870736682355282053;
UPDATE collaborator
SET data.modify('insert
                            <custom_elem>
                                <name>is_a_commerce_client</name>
                                <value>1</value>
                            </custom_elem>
                            as last into
                            (//custom_elems)[1]
                ')
WHERE id = 6870736682355282053;
UPDATE collaborator
SET data.modify('insert
                            <custom_elem>
                                <name>is_project_ended</name>
                                <value>1</value>
                            </custom_elem>
                            as last into
                            (//custom_elems)[1]
                ')
WHERE id = 6870736682355282053;
UPDATE collaborator SET data.modify('insert <custom_elem><name>in_program</name><value>1</value></custom_elem> as last into (//custom_elems)[1]') WHERE id = 6870736682355282053
select data from collaborator where id = 6870736682355282053