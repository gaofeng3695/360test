$(function() {
     loadData();
});
/**
 * 描述：关闭查看页面
 */
function closeDataColumn() {
	top. closeDlg("viewDataColumn");
}
function loadData() {
	id1 = getParamter("id");
    $.getJSON(rootPath+"jasframework/dataColumn/getDataColumnById.do", {
			"eventid" : id1
		}, function(jso) {
		    $("#columnName").html(jso.columnname);
			$("#tableFieldName").html(jso.tablefieldname);
			$("#columnWidth").html(jso.columnwidth);	
			$("#columnOrder").html(jso.columnorder);
			$("#display").html(jso.display);
            $("#sortable").html(jso.sortable);
		});
}


