var businessid = getParamter("objectid");
function loadData() {
	var param = this.location.search;
	if (param != null && "" != param) {
		var objectid = param.substr(1).split("=")[1];
		$("#objectid").val(objectid);
		businessid = objectid;
		var url = "../../geotools/geotoolsQuery.do" + param+"&random="+new Date();
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
function loadDataSel() {
	var param = this.location.search;
	if (param != null && "" != param) {
		var objectid = getParamter("objectid");
			businessid = objectid;
		var url = "../../geotools/geotoolsQuery.do" + param + "&random="
				+ new Date();
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
function save() {
	$('#savePcUser').form('submit', {
		url : "../../geotools/geotoolsAdd.do",
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			
			businessid = result;
//			parent.$('#dlg').dialog('close');
			top.closeDlg('saveiframe');
			reloadData('geotoolsDemo.htm', '#loginLogTable');
		}
	});
}

// 回调函数
function callbackFun(result) {
	if (result.success) {
		$.messager.alert('正确', result.ok, 'ok', function() {
			reloadData('geotoolsDemo.htm', '#loginLogTable');
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

function clos() {
	parent.$('#dlg').dialog('close');
};

//关闭窗口
function closView() {
	top.closeDlg('viewiframe');
};
function closAdd() {
	top.closeDlg('saveiframe');
};