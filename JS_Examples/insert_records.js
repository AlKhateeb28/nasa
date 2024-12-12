x = 0
y = 0
n = 0
//xq = "for $elem in object_datas where object_data_type_id =0x60ADFA9E2FC259B3 return $elem"
xq = "for $elem in object_datas where object_data_type_id =0x60ADFA9E2FC259B3 and modification_date < Date('25.10.2023 15:00:00') return $elem"
//xq = "for $elem in object_datas where object_data_type_id =0x60ADFA9E2FC259B3 and object_id =6857045766725852350 return $elem" object_data_type_id =0x60ADFA9E2FC259B3 and modification_date <Date('25.10.2023 00:00:00')
arr_od_all = ArraySelectAll(XQuery(xq))
//alert(ArrayCount(arr_od_all))
alert('Всего основнах карт ' + ArrayCount(arr_od_all))
for (_od_ in arr_od_all)
{
	xx = _od_.object_id // ИД тренера
	yy = _od_. sec_object_id


	xql = "for $ele in cc_trainers_for_reports where trainer_id = '"+xx+"' return $ele"
	arr_cc_tr_f_r_all = ArraySelectAll(XQuery(xql)) // зависимая карточка если есть
	//alert('Всего зависимых карт ' + ArrayCount(arr_cc_tr_f_r_all))

	xq_tren = "for $elementt in collaborators where id = '"+yy+"' return $elementt"
	_tren = ArrayOptFirstElem(XQuery(xq_tren)) // карточка тренера сотрудника

	xq_col = "for $elemnt in collaborators where id = '"+xx+"' return $elemnt"
	_col = ArrayOptFirstElem(XQuery(xq_col))

	if (ArrayCount(arr_cc_tr_f_r_all) != 0) // Если такой уже есть ArrayCount != 0
	{

	// Проверяем есть ли связь карточек
	_od_doc = tools.open_doc( _od_.id )
	//alert(_od_doc.TopElem.id)



		if (_od_doc.TopElem.custom_elems.ObtainChildByKey('be_associated').value != arr_cc_tr_f_r_all[0].id) // Если не связан то создать связать
		{
		/*
		_od_doc.TopElem.custom_elems.ObtainChildByKey('be_associated').value = arr_cc_tr_f_r_all[0].id // Int?
		_od_doc.Save()
		*/
		x++

		}

	}
	else // если нет карточки то создать и заполнить
	{
		_od_doc = tools.open_doc( _od_.id )
		NewDoc = OpenNewDoc('x-local://udt/udt_cc_trainers_for_report.xmd')
		NewDoc.BindToDb(DefaultDb)




			NewDoc.TopElem.trainer_fullname = _od_doc.TopElem.name // ФИО
			NewDoc.TopElem.email = _col.email // Электронная почта

			NewDoc.TopElem.position_trainer = _col.position_name // Должность

			NewDoc.TopElem.organization_name = _col.org_name // Название организации

			NewDoc.TopElem.organization_inn = _col.org_id.ForeignElem.code // ИНН по организации

			NewDoc.TopElem.region_organization = _col.org_id.ForeignElem.region_id.ForeignElem.name // Регион тренера/ИБП
			NewDoc.TopElem.region_in_reporting = _col.org_id.ForeignElem.region_id.ForeignElem.name // Регион в отчетности

			NewDoc.TopElem.phone = _col.phone //Номер телефона



			NewDoc.TopElem.trainer_type = 'ИБП' //else { NewDoc.TopElem.trainer_type  = 'не установлено'} //Вид тренера

			NewDoc.TopElem.basic_training_program = '7 видов потерь;Картирование;5С;РПУ; ПА;МРП' //else { NewDoc.TopElem.basic_training_program = 'не установлено'} //Основная программа подготовки

			NewDoc.TopElem.support_format = 'РЦК' //else //{ NewDoc.TopElem.support_format  = 'не установлено'} //Формат поддержки

			NewDoc.TopElem.curator_fullname = _od_.sec_object_id.ForeignElem.fullname //ФИО контактного лица/ФИО тренера РЦК

			NewDoc.TopElem.curator_email = _od_.sec_object_id.ForeignElem.email //e-mail контактного лица/e-mail тренера РЦК
			NewDoc.TopElem.result_selection = 'пройден' //



			NewDoc.Save();
	y++
	}
//break
if (n > 290)  {break}
n++
}
alert(x + ' / ' + y + '  /  ' + n)