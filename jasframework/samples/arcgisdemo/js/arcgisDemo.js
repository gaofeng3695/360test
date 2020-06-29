//页面格式
$(function() {
	initDatagrigHeight('loginLogTable', 'searchpanel', 0);

});

//查看数据
function sel() {
	var rows = $('#loginLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#loginLogTable').datagrid('getSelected');
		var objectID = row.objectid;
		top.getDlg("arcgisInfo.htm?objectid=" + objectID, "viewiframe", "查看",
				500, 210);
	} else {
		$.messager.alert('提示', '请选中一条记录', 'info');
	}
}

//加载添加数据页面
function add() {
	top.getDlg("arcgisAdd.htm", "saveiframe", "添加", 600, 400);
}

//加载更新数据页面
function update() {	
	var rows = $('#loginLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#loginLogTable').datagrid('getSelected');
		var objectID = row.objectid;
		top.getDlg("arcgisAdd.htm?objectid=" + objectID, "saveiframe", "更新",
				600, 400);
	} else {
		$.messager.alert('提示', '请选中一条操作日志记录', 'info');
	}
}

//加载删除数据页面
function dele() {
	var rows = $('#loginLogTable').datagrid('getSelections');

	if (rows.length <= 0) {
		$.messager.alert('提示', '请选择要删除的记录!', 'info');
	} else {
		$.messager.confirm('提示', '确定要删除当前记录吗?', function(r) {
			if (r) {
				goDeleRoles();
			}
		});
	}
}

// 开始删除
function goDeleRoles() {
	var rows = $('#loginLogTable').datagrid('getSelections');

	var jsonIds = arrayTojson(rows);

	$.ajax({
		type : "get",
		url : "../../arcgis/arcgisDelete.do",
		data : {
			jsonIds : jsonIds
		},
		success : function(msg) {
			$('#loginLogTable').datagrid('reload');
		}
	});

}

//id数组转换为json字符串
function arrayTojson(arr) {
	var jsonIds = "[";
	for ( var i = 0; i < arr.length; i++) {
		if (i == arr.length - 1) {
			jsonIds += arr[i].objectid;
		} else {
			jsonIds += arr[i].objectid + ",";
		}
	}
	jsonIds += "]";

	return jsonIds;
}