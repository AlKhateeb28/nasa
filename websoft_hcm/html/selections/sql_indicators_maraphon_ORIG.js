// 6883977602579656301
oRes = tools.call_code_library_method( "libEducation", "GetContinuousLearningStat", [ curUserID, OptInt( iObjectID, curObjectID ), iProgramID ] );

VALUE_STR = EncodeJson( oRes.context );