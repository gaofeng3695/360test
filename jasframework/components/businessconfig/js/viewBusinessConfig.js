$(function() {
	loadData();
});
/**
 * 描述：关闭查看页面
 */
function closeRole() {
	top. closeDlg("view");
}
function loadData() {
	var param = this.location.search;
	if (param != null && "" != param) {
		id1 = getParamter("id");
	}
	if (id1 != null && "" != param) {
		$.getJSON(rootPath+"jasframework/businessTable/getBusinessById.do", {
			"eventid" : id1
		}, function(jso) {
			$("#businessName").html(jso.businessname);
			$("#businessTableName").html(jso.businesstablename);
			$("#explanation").html(jso.explanation);	
		});
	}
}


