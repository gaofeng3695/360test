
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	//初始化部门下拉框
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.29,'combobox');
	$('#warntime').val("17:00:00");
});


/**
 * @desc 添加数据-保存
 */
function saveGpsLoginWarning(){
	disableButtion("saveButton");
	var bool=$("#gpsLoginWarningForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpsloginwarning/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsLoginWarningForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_gps_login_warning.html","#gpsLoginWarningdatagrid");
					closePanel();
				});
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else if(data.code == "FM00001") {
				top.showAlert("提示", "该部门阈值设置记录已存在", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
	

}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsLoginWarning");
}

/**
 * @desc 重新加载数据
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
