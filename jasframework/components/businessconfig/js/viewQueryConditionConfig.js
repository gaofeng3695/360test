$(function() {
	loadData();
});
/**
 * 描述：关闭查看页面
 */
function closeRole() {
	top. closeDlg("view1");
}
function loadData() {
	var param = this.location.search;
	if (param != null && "" != param) {
		id1 = getParamter("id");
	}
    if (id1 != null && "" != param) {
		$.getJSON(rootPath+"jasframework/queryConfig/getQueryById.do", {
			"eventid" : id1
		}, function(jso) {
			if(jso.fieldtype==2||"2"==jso.fieldtype){
				$("#dataUrl").html(jso.dataurl);
				$("#fieldName").html(jso.fieldname);
				$("#orderNumber").html(jso.ordernumber);	
				$("#fieldType").html(jso.fieldtypeName);
				$("#valueField").html(jso.valuefield);	
				$("#textField").html(jso.textfield);
				$("#queryName").html(jso.queryname);
				$("#display").html(jso.display);
			}
			else if(jso.fieldtype==3||"3"==jso.fieldtype){
				$("#dataUrl").html(jso.dataurl);
				$("#fieldName").html(jso.fieldname);
				$("#orderNumber").html(jso.ordernumber);	
				$("#fieldType").html(jso.fieldtypeName);
				$("#queryName").html(jso.queryname);
				$("#display").html(jso.display);
				$("#aa").hide();
			}
			else{
				$("#fieldName").html(jso.fieldname);
				$("#orderNumber").html(jso.ordernumber);	
				$("#fieldType").html(jso.fieldtypeName);
				$("#queryName").html(jso.queryname);
				$("#display").html(jso.display);
				$("#aa,#bb").hide();
			}
    	});
	}
}


