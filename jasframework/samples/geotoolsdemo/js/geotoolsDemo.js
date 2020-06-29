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
		top.getDlg("geotoolsInfo.htm?objectid=" + objectID, "viewiframe", "查看",
				500, 210);
	} else {
		$.messager.alert('提示', '请选中一条记录', 'info');
	}
}

//添加数据
function add() {
	top.getDlg("geotoolsAdd.htm", "saveiframe", "添加", 600, 400);
}

//修改数据
function update() {
	var rows = $('#loginLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#loginLogTable').datagrid('getSelected');
		var objectID = row.objectid;
		top.getDlg("geotoolsAdd.htm?objectid=" + objectID, "saveiframe",
				"更新", 600, 400);
	} else {
		$.messager.alert('提示', '请选中一条操作日志记录', 'info');
	}
}

//删除数据
function dele() {
	var rows = $('#loginLogTable').datagrid('getSelections');

	if (rows.length <= 0) {
		$.messager.alert('提示', '请选择要删除的抢维修记录!', 'info');
	} else {
		$.messager.confirm('提示', '你确定要删除当前记录吗?', function(r) {
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
		url : "../../geotools/geotoolsDelete.do",
		data : {
			jsonIds : jsonIds
		},
		success : function(msg) {
			$('#loginLogTable').datagrid('reload');
		}
	});

}

// id数组转换为json字符串
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

