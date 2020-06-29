/**
 * 
 * 文件描述: Excel模板基本信息修改js。
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
	$("#tt").tabs({
		onSelect:function(title,index){
			if(index==1){	
				$('#tableInfoConfig').attr('src','tableInfoConfiguration.htm?templateId='+templateId);
			}
		}
	});
	
	$("#templateType").combobox({
		data:templateTypeList,
		valueField:'id',
		textField:'text',
		panelHeight:86
	});
	$("#datasourceName").combobox({
		url:rootPath + 'jasframework/excel/getDataSourceNamesList.do',
		valueField:'id',
		textField:'text',
		panelHeight:42
	});
	
	var templateId=getParamter('eventid');
	$("#eventid").val(templateId);
	$.ajax({
		url : rootPath + 'jasframework/excel/getTemplateInfoBoById.do',
		type:"POST",
		data:{"eventid":templateId},
		success:function(result){
			$("#templateName").val(result.templateName);
			$("#templatePath").val(result.templatePath);
			$("#functionName").val(result.functionName);
			$("#templateType").combobox("setValue",result.templateType);
			$("#datasourceName").combobox("setValue",result.datasourceName);
			$("#remark").val(result.remark);
		},
		dataType:"json",
		async:false,
		error:function(result){
			$.messager.alert('错误', '请求数据失败！', 'info');
		}
	});
});
/**
 * 方法描述：修改Excel模板基本信息
 */
function updateExcelTemplateInfo(){
	//表单验证
	if($('#updateExcelTempInfo').form('validate') == false){
		return false;
	}
	$.messager.confirm('提示', '如果该模板正在使用，请谨慎修改，以防导致配置的功能失效，是否修改?\n\t', function(r){
		if(r){
			$('#updateExcelTempInfoButton').linkbutton('disable');
		}
		//表单提交
		$.ajax({
			url: addTokenForUrl(rootPath + "jasframework/excel/updateTemplateInfo.do"),
			type: 'post',
			dataType: "json",
			data:$("#updateExcelTempInfo").serializeToJson(),
			success: function(data){
				$('#updateExcelTempInfoButton').linkbutton('enable');
//				var data = jQuery.parseJSON(result);
				if(data.success == "1"){
					$.messager.alert('提示', data.message, 'info',function(){
						$("#tt").tabs("select",1);
						reloadData('queryExcelTemplate.htm', "excelTemplateTable");
					});
				}else{
					$.messager.alert('错误', data.message, 'error');
				}				
			},
			error: function(data){
				$('#updateExcelTempInfoButton').linkbutton('enable');
				$.messager.alert('错误', '修改失败！', 'error');
			}
		});
	});
}
