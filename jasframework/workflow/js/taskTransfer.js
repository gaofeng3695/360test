/**
 * 
 * 类描述: 流程转办管理功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2013-02-21 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */

var taskIds=[];   //要转办的任务ID数组

/**
 * 初始化页面，加载页面数据。
 */
$(document).ready(function(){
	taskIds = getParamter("taskIds");
	if( taskIds.length==0  ){
		top.showAlert(getLanguageValue("tip"),getLanguageValue('workflow.TaskTransferTasksAdd'),'info');
		return;
	}
	processNamesAndTaskNames = decodeURI(decodeURI(getParamter("processNamesAndTaskNames")));
	$("#processNamesAndTaskNamesDiv").html(processNamesAndTaskNames);
});

/**
 * 执行转办
 */
function executeTransfer(){
	var transferUsers = $("#hiddenDiv").val();
	if( typeof(transferUsers) != "undefined" && transferUsers.length>0  ){
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue('workflow.taskTransferUsersAdd'),'info');
		return;
	}
	var remark = $("#remark").val();
	$.messager.confirm(getLanguageValue("workflow.taskTransfer"),getLanguageValue("workflow.taskTransferConfirm"),function(confirm){
		if (confirm){
			workflow.taskTransfer(taskIds.split(","),transferUsers.split(","),remark,function(result){
				if (result.status==-1){
					top.showAlert(getLanguageValue("error"), result.msg, 'error');
				}else{
					top.showAlert(getLanguageValue("tip"), getLanguageValue("workflow.taskTransferSuccess"), 'info',function(){
						refreshTopPage();
						closeThisPage();
					});
				}
		   });
		}
	});
}


/***以下参数为扩展参数****/
var refreshPage = getParamter("refreshPage");  //要刷新的页面
var refreshPageDatagrid = getParamter("refreshPageDatagrid");  //要属性的页面中的datagrid ID
//关闭当前页面
function closeThisPage(){
	closePanel(workflow.page.task.transfer.id);
}
//刷新父页面
function refreshTopPage(){
	if(!(refreshPage||"")){
		return;
	}
	reloadData(refreshPage,refreshPageDatagrid);
}
