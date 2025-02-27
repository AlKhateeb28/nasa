// 7438937117134169299
if(TopElem.subdivision_inn != "") {
    dataList = ArrayDirect(XQuery("sql: " +
        " SELECT os.id, " +
        "       rs.name " +
        " FROM [WTDB].[dbo].orgs os " +
        "    INNER JOIN [WTDB].[dbo].regions rs ON os.region_id = rs.id " +
        " WHERE  os.code = '" + TopElem.subdivision_inn + "'"));


    if(ArrayCount(dataList) > 0) {
        TopElem.subdivision_name = dataList[0].id;
        TopElem.region_name = dataList[0].name;
    } else {
        TopElem.subdivision_name = "";
        TopElem.region_name = "";
    }
}