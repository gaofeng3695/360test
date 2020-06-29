var businessid = getParamter("objectid");

//加载更新页面中数据
function loadData() {
	var param = this.location.search;
	if (param != null && "" != param) {
		var objectid = param.substr(1).split("=")[1];
		$("#objectid").val(objectid);
		businessid = objectid;
		var url = "../../arcgis/arcgisQuery.do" + param+"&random="+new Date();
		$.getJSON(url, function(jso) {
			$("#nameID").val(jso.name);
			$("#typeID").val(jso.type);
			$("#createdateID").val(jso.createdate);
			$("#ordinalID").val(jso.ordinal);
			$("#xcoordinateID").val(jso.xcoordinate);
			$("#ycoordinateID").val(jso.ycoordinate);
		});
	}
}

//加载查看页面中数据
function loadDataSel() {
	var param = this.location.search;
	if (param != null && "" != param) {
		var objectid = getParamter("objectid");
			businessid = objectid;
			var url = "../../arcgis/arcgisQuery.do" + param+"&random="+new Date();
		$.getJSON(url, function(jso) {
			$("#nameID").text(jso.name);
			$("#typeID").text(jso.type);
			$("#createdateID").text(jso.createdate);
			$("#ordinalID").text(jso.ordinal);
			$("#xcoordinateID").text(jso.xcoordinate);
			$("#ycoordinateID").text(jso.ycoordinate);
		});
	}
}

//保存数据
function save() {
	$('#savePcUser').form('submit', {
		url : "../../arcgis/arcgisAdd.do",
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			businessid = result;
			top.closeDlg('saveiframe');
			reloadData('arcgisDemo.htm', '#loginLogTable');
		}
	});
}

// 回调函数
function callbackFun(result) {
	if (result.success) {
		$.messager.alert('正确', result.ok, 'ok', function() {
			reloadData('arcgisDemo.htm', '#loginLogTable');
			uploadfile(closeWindow);
		});
	} else {
		$.messager.alert('错误', result.msg, 'error');
	}

}

function closeWindow() {
	parent.$('#dlg').dialog('close');
}

/* 重新加载数据 */
function reloadData(url, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}

//关闭窗口
function closView() {
	top.closeDlg('viewiframe');
};
function closAdd() {
	top.closeDlg('saveiframe');
};
