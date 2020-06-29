$(document).ready(function() {
	var eventid = getParamter("eventid");
	initpage(eventid);
});

/**
 * 描述：关闭添加页面
 */
function closePanel() {
	top.closeDlg("saveiframe");
}
/**
 * 描述：重新加载数据
 * 
 * @param url
 *            重新加载数据的页面
 * @param elementId
 *            datagridID
 */
function reloadData(url, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}

function initpage(eventid) {
	$.ajax({
		url : rootPath + "/hrms/emploryTest/getEmploryeInfo.do?id=" + eventid,
		success : function(result) {
			setval(result)
		},
		async : false,
		dataType : "json"
	});

	function setval(result) {
		$("#eventid").val(result.eventid);
		$("#name").val(result.username);
		$("#sex").val(result.sex);
		$("#brithday").val(result.brithday);
	}

	/**
	 * 描述：新增用户
	 */
	function save() {
		// 如果不重复则添加用户
		url = "../../emploryTest/updateEmplorye.do";
		$('#employeeAddForm').form(
				'submit',
				{
					url : url,
					onSubmit : function() {
						return $(this).form('validate');
					},
					success : function(result) {

						if (result.success != '-1') {
							top.showAlert(getLanguageValue("success"),
									getLanguageValue("savesuccess"), 'ok',
									function() {
										reloadData('employee.htm',
												'#showEmplorye');
										// 关闭弹出框
										closePanel();
									});
						} else {
							top.showAlert("错误", "添加失败", 'error');
						}
					}
				});
	}

}
