WITH _view_dossier AS (
    SELECT doss.id as id, evs.education_method_id AS edm_id, evrs.person_id, edms.name as edm_name , doss.programs, doss.num_trainings AS doss_count
    FROM [WTDB].[dbo].[cc_dossier_trained_by_rccs] AS doss
             INNER JOIN [WTDB].[dbo].event_results AS evrs ON doss.student_id = evrs.person_id AND evrs.is_assist = 1
             INNER JOIN [WTDB].[dbo].events AS evs ON evrs.event_id = evs.id
             INNER JOIN [WTDB].[dbo].education_methods AS edms ON evs.education_method_id = edms.id
             INNER JOIN [WTDB].[dbo].education_orgs AS edorgs ON evs.education_org_id = edorgs.id AND edorgs.code = 7
    WHERE evs.education_method_id IS NOT NULL
    GROUP BY doss.id, evs.education_method_id, evrs.person_id, edms.name , doss.programs, doss.num_trainings
)
SELECT _view1.id, edm_name = STUFF (
        (SELECT ';' + edm_name
         FROM _view_dossier AS _view2
         WHERE _view2.id = _view1.id
         ORDER BY edm_name
         FOR XML PATH ('')
        ), 1, 1, ''),
       COUNT(_view1.id) as edm_count,
       _view1.programs as programs,
       _view1.doss_count,
       _view1.person_id
INTO _tbl_result
FROM _view_dossier _view1
GROUP BY _view1.id, programs, doss_count, person_id
HAVING doss_count < COUNT(_view1.id)
ORDER BY id; SELECT * FROM _tbl_result; DROP TABLE _tbl_result;

