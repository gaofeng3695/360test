/**
 * @file
 * @desc excel模板查看
 * @author zhangyi
 * @date 2018-08-16
 * @last modified by
 * @last modified time
 */

var oid = getParamter('oid');
var excelTemplateCode = decodeURI(getParamter('excelTemplateCode'));
var excelTemplateName = decodeURI(getParamter('excelTemplateName'));
var remark = decodeURI(getParamter('remark'));

$(function(){
	getInfo();
})

/**
 * @desc 修改初始值展示
 */
 function getInfo(){
    $.ajax({
		url: rootPath + '/jasframework/excelTemplate/get.do',
		dataType:'json',
		type:'get',
		data:{
			"oid": oid
		},
		success:function(result){
			if(result.status == "1"){
				var data = result.data;
				$('#excelTemplateCode').html(data.excelTemplateCode);
			    $('#excelTemplateName').html(data.excelTemplateName);
			    if("2" == data.excelTemplateType){
			    	$('#excelTemplateType').html('导出模板');
			    }else{
			    	$('#excelTemplateType').html('导入模板');
			    }
			    $('#excelTemplatePath').html(data.excelTemplatePath);
			    $('#remark').html(data.remark);
			}else{
				top.showAlert("提示", "详情获取失败", 'info');
			}
		}
	});
 }

/**
 * @desc 关闭
 */
function closePanel(){
	top.closeDlg('viewExcelTemplate');
}