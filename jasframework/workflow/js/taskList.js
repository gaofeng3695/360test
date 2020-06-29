/**
 * 
 * 类描述: 流程实例管理功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2012-12-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */

var workflowTaskUrlRootPath = workflow.URL.task; //流程任务后台请求根路径
var workflowTaskRootPath = workflow.page.task; //流程任务页面根路径
/**
 * 初始化页面，加载页面数据。
 */
$(document).ready(function(){
	//初始化查询条件
	initQueryCondition();
	//初始化流程部署数据列表
	initDatagrid();
});

/**
 * 描述：初始化查询条件
 */
function initQueryCondition(){
	//初始化流程名称列表下拉选
	workflow.getWorkflowNameList(function(result){
		workflow.loadWorkflowName("processKey",result.rows);
	});
	//高级搜索
	workflow.moreQueryHandler(datagridID);
}

/**
 * 描述：初始化datagrid数据
 */
var datagridID = "1011090201";
var datagridObj;
var refreshPageParams="refreshPage="+workflow.page.taskList.url+"&refreshPageDatagrid="+datagridID;
function initDatagrid(){
	datagridObj = $('#'+datagridID);
	datagridObj.datagrid( {
		url : workflowTaskUrlRootPath.allTodoList,
		idField:'taskId',
		pagination : true,
		rownumbers : true,
		singleSelect:true,
		fitColumns: true,
		//contentType:application/json,page rows->pageNo pageSize,sort order->orderBy,data->dataJSONString
		loader : function(param, success, error) { 
			datagridBeforeSend(param, success, error,$(this).datagrid("options"));
		 },
		rowStyler: function(index,row){
			//任务已过期，则特殊标记
			var dueTimeMills = datetimeToMillsConverter(row.dueTime)||0;
			var curTimeMills = new Date().getTime();
			if (dueTimeMills!=0 && dueTimeMills < curTimeMills) {
				return 'background-color:#ff5555;color:#333;';
			}
		},
		columns : [ [ {
			field : 'ck',
		 	title : getLanguageValue('ck'),
			checkbox : true
		}, {
			field : 'proInstName',
			title : getLanguageValue('workflow.proInstName'),
			width:$(this).width() * 0.125,
        	resizable:true,
        	align : "center"
		}, {
			field : 'taskId',
			title : getLanguageValue('workflow.taskName')+"/"+getLanguageValue('workflow.taskId'),
			width:$(this).width() * 0.125,
        	resizable:true,
			sortable : true,
			align : "center",
			formatter:function(value,row){
				return row.taskName+" ("+row.taskId+")";
			}
		}, {
			field : 'startTime',
			title : getLanguageValue('workflow.taskStartTime'),
			width:$(this).width() * 0.15,
        	resizable:true,
			align:"center",
			sortable : true
		},{
			field : 'approveUserName',
			title : getLanguageValue('workflow.taskCandidateUserName'),
			width:$(this).width() * 0.125,
        	resizable:true,
			align:"center",
			formatter:function(value,row){
				value=value||"-";
				return value;
			}
		},  {
			field : 'proInstId',
			title : getLanguageValue('workflow.proInstId'),
			width:$(this).width() * 0.125,
        	resizable:true,
			align:"center",
			sortable : true
		}, {
			field : 'businessKey',
			title : getLanguageValue('workflow.businessKey'),
			width:$(this).width() * 0.125,
        	resizable:true,
        	align:"center",
		}, {
			field : 'startUserName',
			title : getLanguageValue('workflow.proInstStartUserName'),
			width:$(this).width() * 0.125,
        	resizable:true,
			align:"center"
		}, {
			field : 'dueTime',
			title : getLanguageValue('workflow.taskDueTime'), 
			width : 160,
			sortable : true,
			hidden:true
		},{
			field : 'processName',
			title : getLanguageValue('workflow.processName')+"/"+getLanguageValue('workflow.processKey'), 
			width:$(this).width() * 0.125,
        	resizable:true,
        	align:"center",
			formatter:function(value,row){
				return row.processName+"("+row.processKey+")";
			}
		} ] ]
	});	
	initDatagrigHeight(datagridID,'queryDiv',64);
}

/**
 * 根据输入的查询条件进行任务数据查询
 */
function queryData(){
	var query = $('#queryForm').serializeToJson();
	//处理时间格式：将时间转换为毫秒数
	query.startTimeBegin = datetimeToMillsConverter(query.startTimeBegin);
	query.startTimeEnd = datetimeToMillsConverter(query.startTimeEnd);
	datagridObj.datagrid('options').queryParams=query; //把查询条件赋值给datagrid内部变量
	datagridObj.datagrid('load'); //重新加载
}

/**
 * 查看流程图，弹出流程图显示页面窗口
 */
 function showWorkFlowChart() {
	var rows = datagridObj.datagrid("getSelections");
	if (rows.length == 1) {
		workflow.openWorkflowChart('proInstId='+rows[0].proInstId);
	} else {
		workflow.tipChooseRecored();
	}
}

 /**
  * 查看流程历史审批记录，弹出历史审批记录页面窗口
  */
 function showApproveHistory() {
 	var rows = datagridObj.datagrid("getSelections");
 	if (rows.length == 1) {
 		workflow.openApproveHistory('proInstId='+rows[0].proInstId+"&businessKey="+rows[0].businessKey);
 	} else {
 		workflow.tipChooseRecored();
 	}
 }

/**
 * 描述：转办按钮处理函数，弹出任务转办页面窗口
 */
 var taskTransferPath = workflowTaskRootPath.transfer;
function showTaskTransferPage(){
	var rows = datagridObj.datagrid("getSelections");
	if (rows.length == 0) {
		workflow.tipChooseRecored();
		return;
	}
	var taskIds = [];
	var processNamesAndTaskNames = [];
	for(var i=0;i<rows.length;i++){
		taskIds.push(rows[i].taskId);
		processNamesAndTaskNames.push(rows[i].processName+"-"+rows[i].taskName);
	}
	processNamesAndTaskNames = encodeURI(encodeURI(processNamesAndTaskNames));
	top.getDlg(taskTransferPath.url+"?taskIds="+taskIds+"&processNamesAndTaskNames="+processNamesAndTaskNames+"&"+refreshPageParams,
			taskTransferPath.id,getLanguageValue(taskTransferPath.key), 
			taskTransferPath.w, taskTransferPath.h);
}

/**
 * 描述：任务催办
 */
function taskRemind(){
	var rows = datagridObj.datagrid("getSelections");
	if (rows.length == 0) {
		workflow.tipChooseRecored();
		return;
	}
	$.messager.confirm(getLanguageValue("workflow.taskRemind"),getLanguageValue("workflow.taskRemindConfirm"),function(confirm){
		if (confirm){
			var taskIds = [];
			for(var i=0;i<rows.length;i++){
				taskIds.push(rows[i].taskId);
			}
			workflow.taskRemind(taskIds,function(result){
				if (result.status==-1){
					top.showAlert(getLanguageValue("error"), result.msg, 'error');
				}else{
					top.showAlert(getLanguageValue("tip"), getLanguageValue("workflow.taskRemindSuccess"), 'info');
				}
			});
		}
	});
}
