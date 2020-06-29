/**
 * 
 * 文件描述: Excel模板基本信息新增js。
 *
 * @author XuWeiTao
 * 创建时间： 2015-8-27 09:51:07
 * 
 */
//下拉框选择excel模板类型列表

var templateId = "";
/**
 * 
 * 方法描述：初始化页面
 * 
 */
$(document).ready(function() {
	$("#tt").tabs({
		onSelect:function(title,index){
			if(index==1){	
				$('#tableInfoConfig').attr('src','tableInfoConfiguration.htm?templateId='+templateId);
			}
		}
	});
	//$('#tt').tabs('disableTab', 1); //将表配置信息选项卡禁用
	//初始化模板类型
	$("#templateType").combobox({
		data:templateTypeList,
		valueField:'id',
		textField:'text',
		panelHeight:86
	});
	//默认选中第一项
	$("#templateType").combobox("select",templateTypeList[0].id);
	//初始化数据源，默认选中第一项
	$("#datasourceName").combobox({
		url:rootPath + 'jasframework/excel/getDataSourceNamesList.do',
		valueField:'id',
		textField:'text',
		panelHeight:42
	});
	$("#datasourceName").combobox("select","defaultDataSource");
	setComboObjWidth("templateType", 0.3, "combobox");
	setComboObjWidth("datasourceName", 0.3, "combobox");
	
});
/**
 * 
 * 方法描述：保存Excel模板基本信息
 * 
 */
function saveExcelTempInfo(){
	//表单验证
	$('#saveExcelTempInfoButton').linkbutton('disable');
	if($('#saveExcelTempInfo').form('validate')==false){
		$('#saveExcelTempInfoButton').linkbutton('enable');
		return false;
	}else{
		$.ajax({
			url : addTokenForUrl(rootPath + 'jasframework/excel/saveTemplateInfo.do'),
			type: 'post',
			dataType: "json",
			data:$("#saveExcelTempInfo").serializeToJson(),
			success : function(data) {
				$('#saveExcelTempInfoButton').linkbutton('disable');
				if(data.success == "1"){
					$.messager.alert('提示', data.message, 'info',function(){
						templateId = data.eventid;
						$('#tt').tabs('enableTab', 1); //将表配置信息选项卡启用
						$("#tt").tabs("select",1);
						reloadData('queryExcelTemplate.htm', "excelTemplateTable");
					});
				}else{
					// 如果新增失败按钮可用
					$('#saveExcelTempInfoButton').linkbutton('enable');
					$.messager.alert('错误', data.message, 'error');
				}
				
			},
			error: function(data){
				$.messager.alert('提示', '新增失败！', 'error');
			}
		});
	}
}
