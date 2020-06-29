/**
 * 类描述: 已办工作功能js。
 * 
 * @author zhaojz
 * @version 1.0 创建时间： 2012-12-30 上午8:46:07 
 * ********************************更新记录****************************** 
 * 版本： 1.0 修改日期： 修改人： 修改内容：
 * *********************************************************************
 */
var workflowTaskUrlRootPath = workflow.URL.task; //流程任务后台请求根路径

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
	
}
/**
 * 描述：初始化datagrid数据
 */
var datagridID = "myDoneTaskDatagrid";
var datagridObj;
var refreshPageParams="refreshPage="+workflow.page.myTask.url+"&refreshPageDatagrid="+datagridID;
function initDatagrid() {
	datagridObj = $('#'+datagridID);
	datagridObj.datagrid({
		url : workflowTaskUrlRootPath.myDoneList,
//		idField : 'taskId',
		pagination : true,
		rownumbers : true,
		singleSelect:true,
		/*queryParams:{
			appId:defaultAppId
		},*/

		fitColumns: true,
		//contentType:application/json,page rows->pageNo pageSize,sort order->orderBy,data->dataJSONString
		loader : function(param, success, error) { 
			datagridBeforeSend(param, success, error,$(this).datagrid("options"));
		 },
		columns : [ [ {
			field : 'ck',
			title : getLanguageValue('ck'),
			checkbox : true
		}, {
			field : 'processName',
			title : '流程名称', 
			width:$(this).width() * 0.14,
        	resizable:true,
        	align : "center",
			formatter:function(value,row){
				return row.processName;
			}
		}, {
			field : 'proInstName',
			title : '流程主题',
			width:$(this).width() * 0.14,
        	resizable:true,
        	align : "center"
		}, {
			field : 'taskId',
			title : "节点名称/节点ID",
			width:$(this).width() * 0.14,
        	resizable:true,
			sortable : true,
			align : "center",
			formatter:function(value,row){
				return row.taskName+" ("+row.taskId+")";
			}
		},{
			field : 'startUserName',
			title : '发起人',
			width:$(this).width() * 0.1,
        	resizable:true,
			align:"center"
		}, {
			field : 'startTime',
			title : '开始时间',
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			sortable : true
		}, {
			field : 'endTime',
			title : '结束时间',
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			sortable : true
		}, {
			field : 'duration',
			title : '持续时长',
			width:$(this).width() * 0.17,
        	resizable:true,
			align : "center",
			formatter:function(value,row){
				return millsToHmsConverter(value);
			}
		}, {
			field : 'dueTime',
			title : '过期时间',
			width : 150,
			align:"center",
			hidden:true
		},{
			field : 'proInstId',
			title : '流程实例ID',
			width : 100,
			align:"center",
			hidden : true
		}, {
			field : 'businessKey',
			title : '业务数据ID',
			width : 150,
			hidden : true
		}] ],
		onSelect : function(i, row) {
			buttonStatus();
		},
		onSelectAll : function(i, row) {
			buttonStatus();
		},
		onUnselectAll : function(i, row) {
			buttonStatus();
		},
		onDblClickRow : function(index,indexData) {
			workflow.openWorkflowChart('proInstId='+indexData.proInstId);
			workflow.openApproveHistory('proInstId='+row.proInstId+"&businessKey="+row.businessKey);
		}
	});
	initDatagrigHeight(datagridID,'',0);
}
/**
 * 描述：判断按钮可用状态，并根据条件进行按钮可用状态设置
 * 
 * @param datagridObj datagrid对象
 */
function buttonStatus() {
	var rows = datagridObj.datagrid('getSelections');
	if(rows.length!=1){
		$('#101102020103').linkbutton('disable');
		return;
	}
	var taskId = rows[0].taskId;
	workflow.taskIsCanWithdraw(taskId,function(result){
		if (result.status==-1) {
			$('#101102020103').linkbutton('disable');
			return;
		}
		if (result.data == true) {
			$('#101102020103').linkbutton('enable');
		} else {
			$('#101102020103').linkbutton('disable');
		}
	})
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
 * 流程撤回
 */
function taskWithdraw() {
	$.messager.confirm('撤回', '确认撤回任务？', function(confirm) {
		if (confirm) {
			var rows = datagridObj.datagrid("getSelections");
			if (rows.length != 1) {
				workflow.tipChooseRecored();
				return;
			}
			if (rows.length == 1) {
				workflow.taskWithdraw(rows[0].taskId,function(result){
					if (result.status==-1){
						top.showAlert('错误', result.msg, 'error');
					}else{
						top.showAlert('提示', "流程撤回成功", 'info',function() {
							refresh();
						});
					}
				})
			}
		}
	});
}

function refresh(){
	datagridObj.datagrid("reload");
}
