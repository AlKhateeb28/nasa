DROP TABLE _white_gray_ids;
WITH _tempView AS  (SELECT cs.id, cs.org_id, cs.fullname 
                          FROM [WTDB].[dbo].collaborators cs 
                          WHERE cs.login LIKE '%@%' 
                            AND cs.is_dismiss = 0)
    SELECT _tv.id AS white_id, cs.id AS fcc_gray_id, _tv.org_id, _tv.fullname 
        INTO _tmp1 
        FROM _tempView _tv 
                LEFT JOIN [WTDB].[dbo].collaborators cs ON UPPER(_tv.fullname) = UPPER(cs.fullname)
    AND _tv.org_id = cs.org_id
    AND cs.login LIKE 'load_muc%'
    AND cs.is_dismiss = 0;

SELECT _tmp1.white_id, _tmp1.fcc_gray_id, cs.id AS rck_gray_id, _tmp1.org_id, _tmp1.fullname 
        INTO _tmp2 
        FROM _tmp1 
                LEFT JOIN [WTDB].[dbo].collaborators cs ON UPPER(_tmp1.fullname) = UPPER(cs.fullname) 
           AND _tmp1.org_id = cs.org_id 
           AND cs.login LIKE 'rck_muc%' 
           AND cs.is_dismiss = 0;

SELECT _tmp2.white_id, _tmp2.fcc_gray_id, _tmp2.rck_gray_id, cs.id AS tren_gray_id 
        INTO _white_gray_ids 
        FROM _tmp2 
                LEFT JOIN [WTDB].[dbo].collaborators cs ON UPPER(_tmp2.fullname) = UPPER(cs.fullname) 
           AND _tmp2.org_id = cs.org_id 
           AND cs.login LIKE 'tren_muc%' 
           AND cs.is_dismiss = 0;

DROP TABLE _tmp1; DROP TABLE _tmp2; 
        
SELECT * FROM _white_gray_ids



                  WITH _tempView AS  (SELECT cs.id, cs.org_id, cs.fullname
                    FROM [WTDB].[dbo].collaborators cs
                    WHERE cs.login LIKE '%@%'
                      AND cs.is_dismiss = 0
                    AND UPPER(cs.fullname) = 'Ящук Евгения Михайловна'
                    )
SELECT _tv.id AS white_id, cs.id AS fcc_gray_id, _tv.org_id, _tv.fullname
FROM _tempView _tv
         LEFT JOIN [WTDB].[dbo].collaborators cs ON UPPER(_tv.fullname) = UPPER(cs.fullname)
    --AND cs.org_id = _tv.org_id
    AND cs.login LIKE 'load_muc%'
    AND cs.is_dismiss = 0
    AND UPPER(cs.fullname) = 'Ящук Евгения Михайловна'

