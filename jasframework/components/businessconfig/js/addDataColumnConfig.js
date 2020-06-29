var url = "";
var id1;
$(function() {
	loadtablefielaname();
	loadData();
});
function loadtablefielaname() {
	businesstablename = getParamter("businesstablename");
	$.getJSON(rootPath+"jasframework/queryConfig/findAllQueryList.do",{"businesstablename" :businesstablename}, function(data) {
			$("#tableFieldName").combobox({
			data : data,
			width : 185,
			multiple:false,
			valueField : 'FIELDNAME',
			textField :  'FIELDNAME',
			panelHeight : 200
		});
	});
}
/**
 * 描述：关闭添加页面
 */
function closePanel() {
	top.closeDlg("saveiframe");
}
/**
 * 描述：判断是进行新增还是进行更新
 */
function loadData() {
	id1 = getParamter("eventid");
	var id11 = getParamter("eventid1");
	if (id11 != null && "" != id11) {
		$.getJSON(rootPath+"jasframework/dataColumn/getDataColumnById.do", {"eventid" : id11}, function(jso) {
			$("#dataForm").form('load', jso);
            $("#businessid").val(id11);
		});
		$("#tableFieldName").combobox({
			disabled:true
       	});
		url = rootPath+"jasframework/dataColumn/updateDataColumn.do";
	} else {
		url = rootPath+"jasframework/dataColumn/addDataColumn.do?businessid=" + id1;
	}
}
/**
 * 描述：保存按钮执行的操作
 */
function saveData() {
	disableButtion("savebutton");
	$('#dataForm')
			.form('submit',{url : url,onSubmit : function() {
							var bool = $(this).form('validate');
							if (bool == false) {
								enableButtion("savebutton");
							}
							return bool;
						},
						success : function(result) {
							var result = eval('(' + result + ')');
							if (result.success) {top.showAlert(getLanguageValue("tip"),getLanguageValue("savesuccess"),'info', function() {
											reloadData('businessConfig.htm','#dg2');
											closePanel();
										});
							} else {
								top.showAlert(getLanguageValue("tip"),getLanguageValue("字段名重复"),'error');
								$("#tableFieldName").combobox('setValue', "");
								enableButtion("savebutton");
							}
						}
					});
}
/**
 * 描述：保存按钮执行完重新加载页面
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}
