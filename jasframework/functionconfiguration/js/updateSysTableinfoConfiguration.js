/**
 * 
 * 文件描述: 功能模块基本信息修改js。
 *
 * @author zhanggf
 * @version 1.0
 * 创建时间： 2012-12-19 下午04:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-10-16       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */
var eventid=getParamter('eventid');
//页面初始化完毕后执行
$(document).ready(function() {
	var databasetype=getParamter('databasetype');
	var datasourcename=getParamter('datasourcename');
	//加载视图表及数据表
	var viewnameurl=rootPath+'jasframework/getViewNamesList.do?databasetype='+databasetype+"&datasourcename="+datasourcename;
	var tablenameurl=rootPath+'jasframework/getTableNamesList.do?databasetype='+databasetype+"&datasourcename="+datasourcename;
	loadComboboxDataByUrl('viewname',viewnameurl,'VIEW_NAME','VIEW_NAME');
	loadComboboxDataByUrl('tablename',tablenameurl,'TABLE_NAME','TABLE_NAME');	
	$('#tablename').combobox('setValue','');
	$('#viewname').combobox('setValue','');
	
	loadComboboxDataByData("hasattachment",isFieldData);
	loadComboboxDataByData("hasworkflow",isFieldData);
	loadComboboxDataByData("geometerytype",geometrytypeData);
	//初始化数据
	loadSysTableinfoData();
});
/**
 * 方法描述：加载修改页面值
 * @param sid 修改数据id
 */
function loadSysTableinfoData(){
	$.ajax({
		url : rootPath+'jasframework/getSysTableinfoAction.do?eventid='+eventid,
		success : function(data) {

			$('select').each(function(i,item) {
				 var pp = item.id;
				 if(eval('('+'data\.'+pp+')') ==null){
					 $('#'+pp).combobox('setValue','');
				 }else{
					 $('#'+pp).combobox('setValue',eval('('+'data\.'+pp+')'));
				 }
			});
			$('input').each(function(i,item) {
				 var pp = item.id;
				 if(pp==null || pp=="" || eval('('+'data\.'+pp+')') ==null){
					 $('#'+pp).val('');
				 }else{
					 $('#'+pp).val(eval('('+'data\.'+pp+')'));
				 }
			});
		},
		dataType:"json",
		error : function(data) {
			$.messager.alert('提示', '查询修改数据失败', 'error');	
		}
	});
}


/**
 * 方法描述：保存功能模块基本信息
 */
function saveSystableinfo(){
	//表单验证
	if($('#updateSysTableinfo').form('validate')==false)
  		return false;
	$.messager.confirm('提示', '如果该配置信息正在使用，请谨慎修改，以防导致配置的功能失效，是否修改?\n\t',function(r){
		if(r){
			$('#10060106').linkbutton('disable');
			//表单提交
			$.ajax({
				url : addTokenForUrl(rootPath+'jasframework/updateSysTableinfoAction.do'),
				type: 'post',
				dataType: 'json',
				data: $('#updateSysTableinfo').serializeToJson(),
				success : function(data) {
					$.messager.alert('提示', '修改成功！', 'info',function(){
						reloadData('configurationHelpHtmL.htm', "configurationTable");
						top.closeDlg('tableinfoupdate');
					});
				},
				error: function(data){
					// 如果新增失败按钮可用
					$('#10060106').linkbutton('enable');
					$.messager.alert('错误', '修改失败！', 'error');
				}
			});
		}
	});
	
}