var colls = ArraySelectAll(XQuery("sql: select * from collaborators where [login] like '%load_muc_%'"));
var collDoc = null;
var k = 0;
var buf = null;
for(i = 0; i < ArrayCount(colls); i++){
	collDoc = OpenDoc(UrlFromDocID(colls[i].id));
	buf=collDoc.TopElem.login;
	collDoc.TopElem.code = buf; k=k+1;
	collDoc.Save();
}
alert ("Агент завершен, кол-во обработанных записей к= ", k);