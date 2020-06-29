/**
 * 
 * 类描述: 审批记录功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2012-12-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */


var taskId = getParamter("taskId") || ""; //任务id
var businessKey = getParamter("businessKey")||""; //业务主键
var proInstId = getParamter("proInstId")||""; //流程实例ID

$(function() {
	//加载业务页面
	workflow.loadBusinessPage(taskId,businessKey,proInstId,false,function(result){
		if(result.status==-1){
			top.showAlert(getLanguageValue("error"), result.msg, 'error');
			return;
		}
		if(!(result.data||"")){
			top.showAlert(getLanguageValue("info"), getLanguageValue("workflow.businessPageUrlNULL"), 'info');
		}
		$("#businessInfoFrame").attr("src", result.data);
//		hiddenElementIdOfBusinessPage = getParamter("hiddenId",businessPageUrl);
	});
	//流程审批记录
	workflow.getWorkflowComments(businessKey,proInstId,function(result){
		if(result.status==-1){
			top.showAlert(getLanguageValue("error"), getLanguageValue("workflow.getCommentFailure"), 'error');
			return;
		}
		var data = result.rows;
		workflow.loadDatagridComments("approveHistoryDataGrid",data);
 	});
});