// 7031845523358817834
var oContext = tools.read_object(sContext);
var iCertType = oContext.GetOptProperty('BlockName', 'all');

var aCerts = [];
var aRes = [];
var sCondition = "";

if (iCertType != 'all')
{
    sCondition = "AND crs.type_id = " + iCertType;
}

var sQuery = "sql:\
    DECLARE @OBJECT_DATA_TYPE_ID BIGINT = (SELECT TOP 1 id FROM object_data_types WHERE code = 'certificate_type_print_form');\
    \
    SELECT DISTINCT\
        crs.id\
	    ,crs.number\
	    ,crs.type_name\
	    ,crs.delivery_date\
	    ,ods.sec_object_id print_form_id\
        ,ct.data.value('(//custom_elems/custom_elem[name=''name_eval_str'']/value)[1]', 'varchar(max)') name_eval_str\
    FROM\
        certificates crs\
	    JOIN certificate_type ct ON ct.id = crs.type_id\
        JOIN object_datas ods ON ods.object_data_type_id = @OBJECT_DATA_TYPE_ID AND ods.object_id = crs.type_id\
    WHERE\
        crs.person_id = " + curUserID + "\
        " + sCondition + "\
    ORDER BY type_name ASC\
";

aCerts = ArraySelectAll(tools.xquery(sQuery));

for (oCert in aCerts)
{
    docCertificate = tools.open_doc(oCert.id);

    if(docCertificate != undefined)
    {
        docCertificateTE = docCertificate.TopElem;

        try
        {
            sCertificateName = Trim(tools.safe_execution(oCert.name_eval_str, [{'curObject': docCertificateTE, 'tools': tools}]));
        } catch(e)
        {
            sCertificateName = '';
        }

        aRes.push({
            "name": sCertificateName,
            "number": oCert.number.Value,
            "type_name": oCert.type_name.Value,
            "delivery_date": StrDate(oCert.delivery_date.Value, false, false),
            "url": "/view_print_form.html?print_form_id=" + oCert.print_form_id + "&object_id=" + oCert.id + "&sid=" + tools_web.get_sum_sid( oCert.print_form_id, Request.Session.sid )
        });
    }
}

RESULT = aRes;

COLUMNS = [
    { "data": "number", "title": "Номер", "type": "link", "click": "OPENWINDOW={url}", "width": "10%" },
    { "data": "name", "title": "Название", "type": "string", "width": "30%" },
    { "data": "type_name", "title": "Тип сертификата", "type": "string", "width": "30%" },
    { "data": "delivery_date", "title": "Дата выдачи", "type": "string", "width": "30%" }
];