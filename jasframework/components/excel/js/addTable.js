/**
 * 
 * 文件描述: Excel模板基本信息新增js。
 *
 * @author XuWeiTao
 * 创建时间： 2015-8-27 09:51:07
 * 
 */



/**
 * 
 * 方法描述：初始化页面
 * 
 */
$(document).ready(function() {
	var templateId = getParamter('templateId');
	$("#templateId").val(templateId);
	$("#tableName").combobox({
		url:rootPath + 'jasframework/excel/getTableNamesList.do?templateId=' + templateId,
		valueField:'table_name',
		textField:'table_name',
		panelHeight:200
	});
	$("#formType").combobox({
		data:formTypeList,
		valueField:'id',
		textField:'text',
		panelHeight:42
	});
	$("#formType").combobox("setValue",1); 
	$("#geometryType").combobox({
		data:geometryTypeList,
		valueField:'id',
		textField:'text',
		panelHeight:86
	});
	$("#geometryType").combobox("setValue","none");

	$("#isMainTable").combobox({
		data:isMainTableList,
		valueField:'id',
		textField:'text',
		panelHeight:42
	});
	$("#isMainTable").combobox("setValue",0);
	$("#sheetIndex").val(1);
	setComboObjWidth("tableName", 0.3, "combobox");
	setComboObjWidth("formType", 0.3, "combobox");
	setComboObjWidth("geometryType", 0.3, "combobox");
	setComboObjWidth("isMainTable", 0.3, "combobox");
});

/**
 * 
 * 方法描述：保存Excel模板基本信息
 * 
 */
function saveExcelTableInfo(){
	$('#saveExcelTableInfoButton').linkbutton('disable');
	//表单提交
	if($('#saveExcelTableInfo').form('validate')==false){
		$('#saveExcelTableInfoButton').linkbutton('enable');
		return false;
	}else{
		$.ajax({
			url : addTokenForUrl(rootPath + "jasframework/excel/saveTableInfo.do"),
			type: 'post',
			dataType: "json",
			data:$("#saveExcelTableInfo").serializeToJson(),
			success : function(data) {
//			var data = jQuery.parseJSON(result);
				if(data.success == "1"){
					$.messager.alert('提示', data.message, 'info', function(){
						parent.reloadDataGrid();
						closePanel();
					});
				}else{
					// 如果新增失败按钮可用
					$('#saveExcelTableInfoButton').linkbutton('enable');
					$.messager.alert('错误', data.message, 'error');
				}
				
			},
			error: function(data){
				$.messager.alert('提示', '新增失败！', 'error');
			}
		});
	}
}
/**
 * 关闭窗口
 */
function closePanel(){
	parent.closeDlg('addtable');
}