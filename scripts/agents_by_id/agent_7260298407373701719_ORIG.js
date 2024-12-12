// 7260298407373701719
function GetStqFromBool(value)
{
    return (tools_web.is_true(value) ? "true" : "false")
}

function GetPersonCSInsertQuery(oOrg, sCollIds)
{
    sInsertQuery =  "sql:\
        DECLARE @T AS table (id BIGINT);\
        \
        IF (OBJECT_ID('tempdb..#t_upd_cols') IS NOT NULL) DROP TABLE #t_upd_cols;\
                \
        CREATE TABLE #t_upd_cols\
        (\
            id BIGINT\
        );\
        " + ( sCollIds != "" ? "\
        WITH CTE (id) AS\
        (\
            SELECT V.v \
            FROM \
            (\
                VALUES " + sCollIds + "\
            ) AS V(v)\
        )\
        INSERT @T (id)\
        SELECT id \
        FROM CTE;\
        " : "") + "\
        INSERT INTO\
            #t_upd_cols ( id )\
        SELECT\
            cols.id\
        FROM\
            collaborators cols\
            " + ( sCollIds != "" ? "JOIN @T st ON st.id = cols.id" : "") + "\
        WHERE\
            " + ( sCollIds == "" ?
        ("cols.org_id = " + oOrg.id + " AND ") :
        " " ) + " cols.login NOT LIKE '%_muc_%'\
        \
        UPDATE  collaborator\
        SET     data.modify('insert\
                            <custom_elems>\
                            </custom_elems>\
                            as last into\
                            (/collaborator)[1]\
                ')\
        FROM\
            collaborator col\
            JOIN #t_upd_cols cols ON col.id = cols.id AND col.data.exist('//custom_elems') = 0\
                \
        UPDATE  collaborator\
        SET     data.modify('delete\
                            (//custom_elems/custom_elem[name=''in_program'' or name=''is_rck'' or name=''is_roiv'' or name=''is_partner'' or name=''is_project_ended''])\
                ')\
        FROM\
            collaborator col\
            JOIN #t_upd_cols cols ON col.id = cols.id\
                \
        UPDATE  collaborator\
        SET     data.modify('insert\
                            <custom_elem>\
                                <name>in_program</name>\
                                <value>" + ( Trim(oOrg.format_part) != '' ? "true" : GetStqFromBool(oOrg.in_program) ) + "</value>\
                            </custom_elem>\
                            as first into\
                            (//custom_elems)[1]\
                ')\
        FROM\
            collaborator col\
            JOIN #t_upd_cols cols ON col.id = cols.id\
                \
        UPDATE  collaborator\
        SET     data.modify('insert\
                            <custom_elem>\
                                <name>is_rck</name>\
                                <value>" + GetStqFromBool(oOrg.is_rck) + "</value>\
                            </custom_elem>\
                            as first into\
                            (//custom_elems)[1]\
                ')\
        FROM\
            collaborator col\
            JOIN #t_upd_cols cols ON col.id = cols.id\
                \
        UPDATE  collaborator\
        SET     data.modify('insert\
                            <custom_elem>\
                                <name>is_roiv</name>\
                                <value>" + GetStqFromBool(oOrg.is_roiv) + "</value>\
                            </custom_elem>\
                            as first into\
                            (//custom_elems)[1]\
                ')\
        FROM\
            collaborator col\
            JOIN #t_upd_cols cols ON col.id = cols.id\
                \
        UPDATE  collaborator\
        SET     data.modify('insert\
                            <custom_elem>\
                                <name>is_partner</name>\
                                <value>" + GetStqFromBool(oOrg.is_partner) + "</value>\
                            </custom_elem>\
                            as first into\
                            (//custom_elems)[1]\
                ')\
        FROM\
            collaborator col\
            JOIN #t_upd_cols cols ON col.id = cols.id\
                \
        UPDATE  collaborator\
        SET     data.modify('insert\
                            <custom_elem>\
                                <name>is_project_ended</name>\
                                <value>" + GetStqFromBool(oOrg.is_project_ended) + "</value>\
                            </custom_elem>\
                            as first into\
                            (//custom_elems)[1]\
                ')\
        FROM\
            collaborator col\
            JOIN #t_upd_cols cols ON col.id = cols.id\
        \
        IF (OBJECT_ID('tempdb..#t_upd_cols') IS NOT NULL) DROP TABLE #t_upd_cols;\
    "

    return sInsertQuery;
}

function GetModifOrgCSQuery(sTimeFormat, iNumberTime)
{
    var sQuery = "sql:\
        SELECT\
            og.id,\
            og.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') in_program,\
            og.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'nvarchar(1)') format_part,\
            og.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') is_rck,\
            og.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') is_roiv,\
            og.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') is_partner,\
            og.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') is_project_ended\
        FROM\
            orgs ogs\
            JOIN org og ON og.id = ogs.id AND ogs.modification_date > DATEADD(" + sTimeFormat + ", -" + iNumberTime + ", GETDATE())\
    ";

    return sQuery;
}

function GetOrgCSQueryByIds(sOrgsIds)
{
    var sQuery = "sql:\
        DECLARE @T AS table (id BIGINT);\
        \
        WITH CTE (id) AS\
        (\
            SELECT V.v \
            FROM \
            (\
                VALUES " + sOrgsIds + "\
            ) AS V(v)\
        )\
        INSERT @T (id)\
        SELECT id \
        FROM CTE;\
        \
        SELECT\
            og.id,\
            og.data.value('(//custom_elems/custom_elem[name=''in_program'']/value)[1]', 'bit') in_program,\
            og.data.value('(//custom_elems/custom_elem[name=''format_part'']/value)[1]', 'nvarchar(1)') format_part,\
            og.data.value('(//custom_elems/custom_elem[name=''is_rck'']/value)[1]', 'bit') is_rck,\
            og.data.value('(//custom_elems/custom_elem[name=''is_roiv'']/value)[1]', 'bit') is_roiv,\
            og.data.value('(//custom_elems/custom_elem[name=''is_partner'']/value)[1]', 'bit') is_partner,\
            og.data.value('(//custom_elems/custom_elem[name=''is_project_ended'']/value)[1]', 'bit') is_project_ended\
        FROM\
            orgs ogs\
            JOIN @T st ON st.id = ogs.id\
            JOIN org og ON og.id = ogs.id\
    ";

    return sQuery;
}

function GetChangeOrgUserQuery()
{
    var sQuery = "sql:\
        IF (OBJECT_ID('tempdb..#new_user_org_history_data') IS NOT NULL) DROP TABLE #new_user_org_history_data;\
        \
        CREATE TABLE #new_user_org_history_data\
        (\
            id BIGINT,\
            org_id BIGINT\
        );\
        \
        IF (OBJECT_ID('dbo.user_org_history_data') IS NULL)\
        BEGIN\
            CREATE TABLE user_org_history_data (\
                id BIGINT NOT NULL PRIMARY KEY,\
                org_id BIGINT\
            )\
        \
            INSERT INTO\
                user_org_history_data\
            SELECT\
                cols.id,\
                cols.org_id\
            FROM\
                collaborators cols\
        END;\
        ELSE\
        BEGIN\
            INSERT INTO\
                #new_user_org_history_data ( id, org_id )\
            SELECT\
                cols.id,\
                cols.org_id\
            FROM\
                collaborators cols\
                LEFT JOIN user_org_history_data uohd ON cols.id = uohd.id\
            WHERE\
                uohd.id IS NULL\
                OR uohd.org_id != cols.org_id\
        \
            DELETE uohd\
            FROM\
                user_org_history_data uohd\
                JOIN #new_user_org_history_data nuohd ON nuohd.id = uohd.id\
        \
            INSERT INTO\
                user_org_history_data\
            SELECT * FROM #new_user_org_history_data WHERE id IS NOT NULL\
        END;\
        \
        SELECT * FROM #new_user_org_history_data ORDER BY org_id ASC\
    ";

    return sQuery;
}

var iNumberTime = OptInt(Param.number_time, 30);
var sTimeFormat = Trim(Param.time_format);

if(sTimeFormat == '')
{
    sTimeFormat = 'MINUTE';
}

// Изменение кастомных полей у пользователей модифицированных организаций.
var aModifOrgs = ArraySelectAll(XQuery(GetModifOrgCSQuery(sTimeFormat, iNumberTime)));

for(oOrg in aModifOrgs)
{
    res = ArraySelectAll(XQuery( GetPersonCSInsertQuery(oOrg, "") ));
}

// Изменение кастомных полей у пользователей, сменивших организацию.
var aChangeOrgUsers =  ArraySelectAll(XQuery( GetChangeOrgUserQuery() ));
if(ArrayOptFirstElem(aChangeOrgUsers) != undefined)
{
    var sOrgsQueryIds = ArrayMerge(aChangeOrgUsers, "'(' + This.org_id + ')'", ', ');
    var aChangeOrgs = ArraySelectAll(XQuery(GetOrgCSQueryByIds(sOrgsQueryIds)));

    for(oOrg in aChangeOrgs)
    {
        aCurColls = ArraySelectBySortedKey(aChangeOrgUsers, oOrg.id, "org_id" );
        sCurCollsQuery = ArrayMerge(aCurColls, "'(' + This.id + ')'", ', ');

        res = ArraySelectAll(XQuery( GetPersonCSInsertQuery(oOrg, sCurCollsQuery) ));
    }
}