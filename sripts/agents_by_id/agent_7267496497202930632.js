// 7267496497202930632
var data_s_ = Param.data_s;
var data_po_ = Param.data_po;
var type_f = Param.type_f;
var rejim = Param.rejim;

err_r_id = 0;
err_r_c = 0;
err_err = '';
er = '';
yyyy = '';
yyyyy = '';

find_m = "for $elem in resources where type = '" + type_f + "' and creation_date > Date('" + data_s_ + "') and creation_date < Date('" + data_po_ + "') and person_id != '' and use_count = '0' order by $elem/id return $elem"

find_res = ArraySelectAll( XQuery (find_m));

y = 0;
x = 0;

for (_res in find_res) {
    if ((_res.id != undefined) && (_res.id != null )) {
        res_ = OpenDoc( UrlFromDocID(Int(_res.id)) );
        res_n = res_.TopElem;
        if ((res_n.person_id != undefined) && res_n.person_id != null){
            try {
                _col = OpenDoc( UrlFromDocID(Int(res_n.person_id)) );

                res_coll = _col.TopElem;

                if ((res_coll.access.access_role == 'OrganizingTrainer') || (res_coll.access.access_role == 'OrganizingTrainerRCK')) {
                    rejim == 'delete' ? DeleteDoc( UrlFromDocID( Int( _res.id ) ) ) : err_err = ( err_err + _res.id + ' ');
                    y++;
                }
            } catch (error) {
                err_r_c++;
                er = _res.id + '';
                err_err += er + '/';
            }
        }
        else {
            err_r_c++;
        }
    }
    else {
        err_r_id++;
    }

    x++;
}

alert('Всего найдено - ' + x + ' файлов ' + 'Представлено к удалению - ' + y + '  отсутствие ИД у ресурса - ' + err_r_id + '  отсутствие ИД сотрудника - ' + err_r_c);
rejim == 'delete' ?	alert('Удалены: ' + y ): alert('С ошибками: ' + err_err);