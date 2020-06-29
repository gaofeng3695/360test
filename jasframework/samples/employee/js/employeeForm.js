var addOrUpdateWindow = "employeeAddOrUpdate";
var unitid =getParamter("unitid");
var url = "";
/**
 *页面初始化 
 */
$(function (){
	loadData();
});
/**
 *新增 
 */
function save(){
	$("#saveEmployeeForm").form('submit',{
		url : url,
		onSubmit : function(){
			return $(this).form('validate');
		},
		success : function(result){
			businessid=result;
			uploadfile(closeWindow);
			reloadData('employeeDataGrid.htm', '#employeeListTable');
		}
	});
}

function closeWindow(){
	top.closeDlg(addOrUpdateWindow);
}

/**
 * 重新加载数据
 */
function reloadData(url, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}
/**
 * 加载数据
 */
function loadData() {
	var id1;
	var param = this.location.search;
	if (param != null && "" != param) {
		var d = param.substr(1).split("&");
		$.each(d, function(i, item) {
			var p = item.split("=");
			if (p[0] == 'eventid') {
				id1 = p[1];
			}
		});
	}
	if (id1 != null && "" != param) {
		$.getJSON("../../sample/getEmployeeById.do?random=" + new Date().getTime(), {
			"eventid" : id1
		}, function(jso) {
			$("#saveEmployeeForm").form('load', jso);
			$("#eventid_").val(id1);
		});
		url = rootPath+"/jasframework/sample/addEmployee.do?unitid=" + unitid;
	} else {
		url = rootPath+"jasframework/sample/addEmployee.do?unitid=" + unitid;
	}

}
