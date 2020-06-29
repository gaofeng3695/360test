/**
 * 
 * 类描述: 流程审批页面js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2012-12-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */

var taskId = getParamter("taskId");  //要审批的任务ID
var businessPageUrl = "";  //业务页面地址
var taskOutflows = [];  //任务输出线路
/**
* 初始化页面，加载页面数据。
*/
$(function() {
	//加载业务页面
	workflow.loadBusinessPage(taskId,null,null,false,function(result){
		if(result.status==-1){
			top.showAlert(getLanguageValue("error"), result.msg, 'error');
			return;
		}
		if(!(result.data||"")){
			top.showAlert(getLanguageValue("info"), getLanguageValue("workflow.businessPageUrlNULL"), 'info');
		}
		businessPageUrl = result.data;
		$("#businessInfoFrame").attr("src", result.data);
		//需要隐藏的业务页面元素ID（多个页面元素ID使用逗号分隔）
		var hiddenElementIdOfBusinessPage = getParamter("hiddenId",businessPageUrl);
		var businessIframe = $("#businessInfoFrame")[0];    
        if (businessIframe.attachEvent) {    
        	businessIframe.attachEvent("onload", function() {    
                //iframe加载完成后你需要进行的操作  
            });  workflow.hiddenBusinessPageContent($("#businessInfoFrame")[0].contentWindow,hiddenElementIdOfBusinessPage);  
        } else {    
        	businessIframe.onload = function() {    
              //iframe加载完成后你需要进行的操作  
            	workflow.hiddenBusinessPageContent($("#businessInfoFrame")[0].contentWindow,hiddenElementIdOfBusinessPage);
            };    
        } 
	});
	
	//流程审批记录
	workflow.getWorkflowComments(null,getParamter("proInstId"),function(result){
		if(result.status==-1){
			top.showAlert(getLanguageValue("error"), getLanguageValue("workflow.getCommentFailure"), 'error');
			return;
		}
		var data = result.rows;
		workflow.loadDatagridComments("approveHistoryDataGrid",data);
	});
	//加载审核按钮
	loadApproveButtons();
});
/**
 * 加载审核按钮
 * @return
 */
function loadApproveButtons(){
	//获取办理的按钮
	workflow.getCurrentTaskNodeOutflows(taskId,function(result){
		//获取数据失败，则提示
		if(result.status==-1){
			top.showAlert(getLanguageValue("error"), getLanguageValue("workflow.getOutflowsFailure")+":"+result.msg, 'error');
			return;
		}
		var data = result.data;  //{"current":当前节点属性,"outflows":当前节点的流转线路}
		var outflows = data.outflows; //{"线路ID1":{"outflowId":线路ID,"outflowName":"线路名称","pass":"是否通过true/false","chooseUser":"是否需要选人true/false","target":{线路目标节点属性JSON格式}}}
		taskOutflows = outflows;
		var currentNodeCustomDocumentation = data.current.documentation;
		$.each(outflows,function(i, item) {
			var bb = "<a href='javascript:void(0);' id='button_"+i+"' class='easyui-linkbutton save-btn approve-workflow-btn' " +
					"onclick='executeAction("
						+ "\""			
						+ item.outflowId
						+ "\",\""
						+ item.outflowName
						+ "\",\""
						+ item.pass
						+ "\",\""
						+ item.chooseUser
						+ "\")' style='margin-left: 10px;'>"
						+ item.outflowName + "</a>";
			console.log(bb);
			$('#approveButtons').append(bb);	
		});
		//是否允许驳回至发起人节点（即流程定义中的第一个任务节点）
//		if("false"==currentNodeCustomDocumentation.allowRejectToFirst){
//			
//		}else{
//			taskOutflows[""]={"target":""};
//			var bb = "<a href='javascript:void(0);' id='button_"+"' class='easyui-linkbutton cancel approve-workflow-btn' " +
//				"onclick='executeAction(\"returnToStart\",\""+getLanguageValue("workflow.approveRejectToFirst")+"\",\"false\",\"false\")' style='margin-left: 10px;'>"
//			+ getLanguageValue("workflow.approveRejectToFirst") + "</a>";
//			$('#approveButtons').append(bb);
//		}
		$.parser.parse($('#approveButtons'));
	});
}

var flowVars = {}; //封装流程变量
var selectUserVars = {}; //选人变量
function executeAction(outflowId,outflowName,pass,chooseUser){
	/**
	 * 执行自定义逻辑方法businessPageUrl=jasframework/log/businessForm.htm?flow3=updateForWorkflow()&hiddenId=10060106,10060107&pkfield=
	 * flow3=updateForWorkflow()：用来指明用户在进行该节点任务办理且选择的审批按钮为线路flow3对应的审批按钮（线路flow3可能代表审批通过，对应于“通过”按钮）时需要进行业务逻辑操作。调用的业务逻辑操作方法为业务功能页面提供的updateForWorkflow()方法，此方法必须返回一个bollean值，表示业务逻辑操作成果或者失败
	 */
	var dataHandle = getParamter(outflowId,businessPageUrl);
	if(dataHandle != null && dataHandle != ''){
		//业务代码执行成功后，再进行任务审批
		var iframeContent = $("#businessInfoFrame")[0].contentWindow;//业务信息页面对象
		if(!iframeContent.eval(dataHandle)){
			return;
		}
	}
	//设置流程变量
	flowVars={
		"outflowId":outflowId,
		"outflowName":outflowName,
		"pass":pass
	};
	if(outflowId=="returnToStart"){  //驳回至发起人节点
		flowVars.returnToStart="true";
	}
	var taskOutflow = taskOutflows[outflowId];
	if(taskOutflow!=null){
		//添加其他流程变量
		if(taskOutflow.variables!=null){
			var variables = taskOutflow.variables||{};
			for(var key in variables){
				flowVars[key]=variables[key];
			}
		}
		//自定义线路选择条件
		var outcome = taskOutflow.outcome || "";
		if(outcome!=""){
			flowVars["outcome"]=outcome;
		}
	}
	//根据是否选人参数，打开选人页面
	if(chooseUser=="true"){
		var customJSON = taskOutflow.target.documentation||{};
		flowVars.chooseUserVariable="nextCandidateUsers";  //默认候选办理人变量是nextCandidateUsers
		if((customJSON.chooseUserVariable||"")){
			flowVars.chooseUserVariable=customJSON.chooseUserVariable;
		}
		//根据选人类型，打开不同的选人页面
		var selectType = "default";  //系统默认提供的选人控件
		if((customJSON.chooseUserType||"")){
			selectType = customJSON.chooseUserType;
		}
		selectUserVars.selectType = selectType;
		var paramsJSON = {}; //其他需要传递给选人页面的参数
		selectUserVars.params = paramsJSON;
		//打开选人窗口
		openSelectUserWindow();
	}else{
		approveTask();
	}
}
/**
 * 打开选人对话框
 * @returns
 */
function openSelectUserWindow(){
	$('#selectPerson').window('open');
}
/**
 * 关闭选人对话框
 * @returns
 */
function closeSelectUserWindow(){
	$('#selectPerson').window('close');
}
/**
 * 打开选人页面
 * @returns
 */
function selectUserPage(){
	var selectType = selectUserVars.selectType;
	var paramsJSON = selectUserVars.params;
	//打开选人页面
	personchoose.showPersonSelectWindow('nextApproveUserNames','nextApproveUserIds',selectType,JSON.stringify(paramsJSON));
}
/**
 * 选人办理确认
 * @returns
 */
function confirmUser(){
	//设置下一节点候选办理人
	var nextCandidateUsers = $("#nextApproveUserIds").val()+"";
	if(nextCandidateUsers==""){
		top.showAlert(getLanguageValue("tip"), getLanguageValue("workflow.selectNextApproveUser"), 'info');
		return;
	}
	closeSelectUserWindow();
	flowVars[flowVars.chooseUserVariable]=nextCandidateUsers;
	//审批任务
	approveTask();
}
/**
 * 审批任务
 */
function approveTask() {
	var validateFormResult = $("#approveCommentForm").form('validate');
	if(!validateFormResult){
		top.showAlert(getLanguageValue("tip"), getLanguageValue("workflow.inputApproveAuditContent"), 'info');
		return;
	}
	//设置审批意见
	var auditContent = $("#auditContent").val();
	flowVars.auditContent=auditContent;
	
	//获取挂接的业务页面中需要传递的流程变量
	var iframeContent = $("#businessInfoFrame")[0].contentWindow;//业务信息页面对象
	//获取页面信息页面中定义的下一节点任务变量对象
	try{
		var workflowVarObj = iframeContent.$(".workflowVar");
		if( typeof(workflowVarObj) != "undefined" ){
			workflowVarObj.each(function(i){
				if( typeof($(this).val()) == "string" && typeof($(this).attr("id")) != "undefined" ){
					flowVars[$(this).attr("id")]=$(this).val();
				}
			});
		}
	}catch (e) {
		console.log("ERROR:获取业务页面流程变量失败！"+e);
	}
//	approve();
	if(document.getElementById("businessInfoFrame").contentWindow.saveAndApprove && typeof (document.getElementById("businessInfoFrame").contentWindow.saveAndApprove) == "function"){
        document.getElementById("businessInfoFrame").contentWindow.saveAndApprove();
    }else{
    	approve()
    }
}


/**
 * 流程节点审批
 */
function approve(){
//	if(document.getElementById("businessInfoFrame").contentWindow.callback && typeof (document.getElementById("businessInfoFrame").contentWindow.callback) == "function"){
//        document.getElementById("businessInfoFrame").contentWindow.callback();
//    }
	disable();
	workflow.taskApprove(taskId,flowVars,function(result){
		if(result.status==-1){
			//审批失败，服务器返回异常：result.code异常编码 result.msg异常描述
			top.showAlert(getLanguageValue('error'), getLanguageValue('办理失败')+result.msg, 'error');
			enable();
			return;
		}
		//判断是否传阅
		var copyToUserIds = $("#copyToUserIds").val()||"";
		if(copyToUserIds==""){
			top.showAlert(getLanguageValue('tip'), getLanguageValue('办理成功'), 'info', function() {
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
				top.showAlert(getLanguageValue('tip'), getLanguageValue('workflow.approveSuccess')+" - "+getLanguageValue('workflow.copyToFailed')+result.msg, 'info');
				enable();
				return;
			}else{
				//审阅成功、传阅成功
				top.showAlert(getLanguageValue('tip'), getLanguageValue('workflow.approveSuccess')+" - "+getLanguageValue('workflow.copyToSuccess'), 'info',function() {
					refreshTopPage(); //刷新父页面
					closeThisPage();//关闭当前页面
				});
				return;
			}
		})
	});
}
function enable(){
	$(".approve-workflow-btn").linkbutton('enable'); 
}
function disable(){
	$(".approve-workflow-btn").linkbutton('disable');
}

/***以下参数为扩展参数****/
var iframeID = workflow.page.task.approve.id;  //要关闭的窗口ID
var refreshPage = getParamter("refreshPage");  //要刷新的页面
var refreshPageDatagrid = getParamter("refreshPageDatagrid");  //要属性的页面中的datagrid ID
//关闭当前页面
function closeThisPage(){
	closePanel(iframeID);
}
//刷新父页面
function refreshTopPage(){
	if(!(refreshPage||"")){
		return;
	}
	reloadData(refreshPage,refreshPageDatagrid);
}