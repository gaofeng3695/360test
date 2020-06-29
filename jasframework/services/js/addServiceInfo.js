/**
 * 方法描述:
 */

function saveServiceInfo(){
	//alert($("#contentDisplay").val());
//	$("#content").val($("#contentDisplay").val());
	$('#serviceInfoForm').form('submit', {
		url : rootPath+"/serviceInfo/addServiceInfo.do",//"",
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
/**
 * 描述：关闭添加页面
 */
function closePanel() {
	top. closeDlg("addiframe");
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
