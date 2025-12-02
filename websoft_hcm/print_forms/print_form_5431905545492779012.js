<%
    // 5431905545492779012

    if (Request.QueryString.HasProperty("object_id") && Request.QueryString.HasProperty("code")) {
        code = Request.QueryString.GetProperty("code");

        print_form_array = XQuery("for $elem in print_forms where $elem/code='"+code+"' return $elem");

        print_form = ArrayOptFirstElem( print_form_array );

        if(ArrayCount() == 0) {

        }

        str = "<center><a href='" + "view_print_form.html?print_form_id=" + print_form.id + "&object_id="+
            Request.QueryString.GetProperty("object_id")+"&sid=" + tools.get_sum_sid( print_form.id )+"'><h2>Печать</h2></a><center>";

        Response.Write(str);
    }
%>