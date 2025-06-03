// 7438937117134169299
if(TopElem.subdivision_inn != "") {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT os.id, " +
        "       rs.name " +
        " FROM [WTDB].[dbo].orgs os " +
        " INNER JOIN [WTDB].[dbo].org o ON os.id = o.id " +
        "    INNER JOIN [WTDB].[dbo].regions rs ON o.data.value('(org/custom_elems/custom_elem[name=''fact_region_id''])[1]/value[1]', 'bigint') = rs.id " +
        " WHERE os.code = '" + TopElem.subdivision_inn + "'"));


    if(ArrayCount(dataList) > 0) {
        TopElem.subdivision_name = dataList[0].id;
        TopElem.region_name = dataList[0].name;
    } else {
        TopElem.subdivision_name = "";
        TopElem.region_name = "";
    }
}