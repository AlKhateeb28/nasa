// 4919131752989213809
var certificate_type_id = 7015457522352069961
var col_id = activeLearningDoc.person_id
sql_str = "sql:
SELECT
*
FROM certificates
LEFT JOIN certificate ON certificate.id = certificates.id
WHERE certificates.type_id = " + certificate_type_id + "
AND certificates.person_id = " + col_id + "
AND certificate.data.value('(certificate/custom_elems/custom_elem[name=''course_id''])[1]/value[1]' ,'varchar(max)') = '" + activeLearningDoc.course_id + "'
"
found_col_certificate = ArrayOptFirstElem( XQuery( sql_str ) )
//if ( found_col_certificate == undefined ) {
docCertificate = tools.create_certificate_to_person( col_id, certificate_type_id )
docCertificate.TopElem.serial = "ЭК"
docCertificate.TopElem.delivery_date = Date()
docCertificate.TopElem.custom_elems.ObtainChildByKey( "course_id" ).value = activeLearningDoc.course_id
docCertificate.Save()
//}