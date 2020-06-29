/**
 * 
 * 类描述: 审阅功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2012-12-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */


//任务id
var taskId = getParamter("taskId");
var pkfield = getParamter("pkfield");
var businessKey = getParamter("businessKey");
var proInstId = getParamter("proInstId");

/**
 * 初始化页面，加载页面数据。
 */
$(function() {
	//加载业务页面
	workflow.loadBusinessPage(null,null,proInstId,false,function(result){
		if(result.status==-1){
			top.showAlert(getLanguageValue("error"), result.msg, 'error');
			return;
		}
		if(!(result.data||"")){
			top.showAlert(getLanguageValue("info"), getLanguageValue("workflow.businessPageUrlNULL"), 'info');
		}
		$("#businessInfoFrame").attr("src", result.data);
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

/**
 * 描述：审阅待阅信息
 */
function read() {
	var validateForm = $("#commentForm");
	var saveBtnId = "readBtn";
	disableButtion(saveBtnId);
	var validateResault = validateForm.form("validate");
	if(validateResault == false){
		enableButtion(saveBtnId);
		return validateResault;
	}
	var params = validateForm.serializeToJson();
	workflow.taskCopyRead(pkfield,params.comment,function(result){
		if(result.status==-1){
			//审阅失败，服务器返回异常：result.code异常编码 result.msg异常描述
			top.showAlert(getLanguageValue('error'), getLanguageValue('workflow.readFailed')+result.msg, 'error');
			enableButtion(saveBtnId);
			return;
		}
		//判断是否传阅
		var copyToUserIds = $("#copyToUserIds").val()||"";
		if(copyToUserIds==""){
			top.showAlert(getLanguageValue('tip'), getLanguageValue('workflow.readSuccess'), 'info', function() {
				refreshTopPage(); //刷新父页面
				closeThisPage();//关闭当前页面
			});
			return;
		}
		//传阅任务
		validateForm = $("#copyToRemarkForm")
		var validateResault = validateForm.form("validate");
		if(validateResault == false){
			return validateResault;
		}
		var params = validateForm.serializeToJson();
		workflow.taskCopyToUsers(taskId,copyToUserIds.split(","),params.remark,function(result){
			if(result.status==-1){
				//审阅成功、传阅失败
				//传阅失败，服务器返回异常：result.code异常编码 result.msg异常描述
				top.showAlert(getLanguageValue('tip'), getLanguageValue('workflow.readSuccess')+" - "+getLanguageValue('workflow.copyToFailed')+result.msg, 'info');
				enableButtion(saveBtnId);
				return;
			}else{
				//审阅成功、传阅成功
				top.showAlert(getLanguageValue('tip'), getLanguageValue('workflow.readSuccess')+" - "+getLanguageValue('workflow.copyToSuccess'), 'info',function() {
					refreshTopPage(); //刷新父页面
					closeThisPage();//关闭当前页面
				});
				return;
			}
		})
	});
}



/***以下参数为扩展参数****/
var refreshPage = getParamter("refreshPage");  //要刷新的页面
var refreshPageDatagrid = getParamter("refreshPageDatagrid");  //要属性的页面中的datagrid ID
//关闭当前页面
function closeThisPage(){
	closePanel(workflow.page.read.id);
}
//刷新父页面
function refreshTopPage(){
	if(!(refreshPage||"")){
		return;
	}
	reloadData(refreshPage,refreshPageDatagrid);
}
