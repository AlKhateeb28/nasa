if( !LdsIsServer )
{
    excel_url = Screen.AskFileOpen( "NAME", "Выбери файл *.xls*" );
    excel_object = new ActiveXObject( "Excel.Application" );
    excel_file = excel_object.Workbooks.Open( excel_url );
    excel_sheet = excel_file.Worksheets( 1 );
    x = 0;
    var skip_first_row = "1";
    var key_column = 1;


    cur_row = 2 ;
    nnn = 1;

    if ( excel_sheet.Cells( cur_row, key_column ).Value == undefined && excel_sheet.Cells( cur_row, key_column ).Value != '') { nnn = 1 };
    while ( nnn != 0 )
    {

        NewDoc = OpenNewDoc('x-local://udt/udt_cc_dossier_trained_by_rcc.xmd');
        NewDoc.BindToDb(DefaultDb);

        if ( excel_sheet.Cells( cur_row, 1 ).Value != undefined ) {NewDoc.TopElem.in_month = excel_sheet.Cells( cur_row, 1 ).Value;} // Учтен в месяце
        if ( excel_sheet.Cells( cur_row, 2 ).Value != undefined ) {NewDoc.TopElem.in_year = excel_sheet.Cells( cur_row, 2 ).Value;} // Учтен в году
        if ( excel_sheet.Cells( cur_row, 3 ).Value != undefined ) {NewDoc.TopElem.student_code = excel_sheet.Cells( cur_row, 3 ).Value;} // Код уникального обученного в СДО
        if ( excel_sheet.Cells( cur_row, 4 ).Value != undefined ) {NewDoc.TopElem.student_fullname = excel_sheet.Cells( cur_row, 4 ).Value;} // ФИО обученного силами РЦК
        if ( excel_sheet.Cells( cur_row, 5 ).Value != undefined ) {NewDoc.TopElem.student_position = excel_sheet.Cells( cur_row, 5 ).Value;} // Должность обученного
        if ( excel_sheet.Cells( cur_row, 6 ).Value != undefined ) {NewDoc.TopElem.subdivision_inn = excel_sheet.Cells( cur_row, 6 ).Value;} // ИНН организации
        if ( excel_sheet.Cells( cur_row, 7 ).Value != undefined ) {NewDoc.TopElem.subdivision_name = excel_sheet.Cells( cur_row, 7 ).Value;} // Организация
        if ( excel_sheet.Cells( cur_row, 8 ).Value != undefined ) {NewDoc.TopElem.region_name = excel_sheet.Cells( cur_row, 8 ).Value;} // Регион
        if ( excel_sheet.Cells( cur_row, 9 ).Value != undefined ) {NewDoc.TopElem.reporting_region_name = excel_sheet.Cells( cur_row, 9 ).Value;} //Учитывать в отчетности региона
        if ( excel_sheet.Cells( cur_row, 10 ).Value != undefined ) {NewDoc.TopElem.num_trainings = excel_sheet.Cells( cur_row, 10 ).Value;} //Количество посещенных мероприятий
        if ( excel_sheet.Cells( cur_row, 11 ).Value != undefined ) {NewDoc.TopElem.programs = excel_sheet.Cells( cur_row, 11 ).Value;} // else { NewDoc.TopElem.trainer_type  = 'не установлено'} //список мероприятий

        excel_sheet.Cells( cur_row, 12 ).Value = 'Выполнено';

        if ( excel_sheet.Cells( cur_row, 1 ).Value == undefined)
        {

            excel_sheet.Cells( cur_row, 1 ).Value = 'Конец списка'; // Запись окончания

            nnn == 0; // стоп обработки
            break;
        }



        NewDoc.Save();
        cur_row++;
        x++;


    }

    excel_file.Save();
    alert('SAVE EXCEL' + '  all = ' + x);
    excel_object.Application.Quit();

}