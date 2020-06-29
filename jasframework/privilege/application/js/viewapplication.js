//初始化
$(function() {
	$("#dlg").panel("open");
	loadData();
});

/**
 * 描述：关闭查看页面
 */
function closeRole() {
	top. closeDlg("view");
}
/**
 * 描述：初始化数据
 */
function loadData() {
	var oid=getParamter("oid");
	$.getJSON(rootPath+"jasframework/privilege/application/getById.do?oid="+oid+"&r="+new Date().getTime(),function(data){
		putValue(data);
	});
}

/**
 * 描述：显示数据
 * @param obj 数据
 */
function putValue(obj) {
	$("#appName").html(obj.appName);
	$("#roleName").html(obj.roleName);
	$("#appId").html(obj.oid);
	$("#description").html(obj.description);
	$("#appUrl").html(obj.appUrl);
}
