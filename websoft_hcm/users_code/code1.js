alert('Импорт доменных логинов запущен');

Path = Trim(Param.Path);
Domain = Trim(Param.Domain);

db = new ActiveXObject( "ADODB.Connection" );
db.CommandTimeout = 30;
db.Open('Provider=ADSDSOObject;Trusted_Connection=yes;');

arrUsers = XQuery('for $elem in collaborators where $elem/email != "" and $elem/is_dismiss = false() return $elem');
for (_user in arrUsers)
{
    try
    {
        _sres = db.Execute("SELECT sAMAccountName FROM 'LDAP://"+Path+"' WHERE mail='"+_user.email+"'");

        if (!_sres.EOF)
        {
            _userDoc = OpenDoc(UrlFromDocID(_user.id));
            _userDoc.TopElem.login = Domain + '\\' + _sres.Fields(0);
            _userDoc.Save();
            alert('Импортирован логин по сотруднику: ' + _user.fullname);
        }
    }
    catch (e) alert('Ошибка импорта логина по сотруднику: ' + _user.fullname + ', ' + e);
}


alert('Импорт доменных логинов завершен');