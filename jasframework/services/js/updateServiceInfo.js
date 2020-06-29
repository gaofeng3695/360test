/**
 * 方法描述:
 */
function saveServiceInfo(){
//	$("#content").val($("#contentDisplay").val());
	$('#serviceInfoForm').form('submit', {
		url : rootPath+"/serviceInfo/updateServiceInfo.do",//"",
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(data) {
			var data = eval('(' + data + ')');
			if(data.success==1){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("queryServiceInfo.html","#serviceInfoDatagrid");
					closePanel();
				});
			}
		}
	});
}
jQuery.fn.ready(function(){
	getServiceInfoById();
});
/**
 * 描述：获得数据
 */
function getServiceInfoById(){
	var eventId=getParamter("eventId");
	$.getJSON(rootPath+"/serviceInfo/getServiceInfoById.do", {
		"eventId" : eventId
	}, function(data) {
		loadData(data);
	});
}
/**
 * 描述：数据加载到页面
 */
function loadData(jsondata){
	$('#serviceInfoForm').form('load',jsondata);
}

/**
 * 描述：重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}
/**
 * 描述：关闭添加页面
 */
function closePanel() {
	top. closeDlg("updateiframe");
}

