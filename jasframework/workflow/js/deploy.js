/**
 * 
 * 类描述: 部署流程功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2012-12-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */

var workflowDeployUrlRootPath = workflow.URL.deploy; //流程部署后台请求根路径
var workflowDeployRootPath = workflow.page.deploy; //流程部署页面根路径
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
}

/**
 * 描述：初始化流程部署数据列表
 */
var datagridObj;//datagrid对象
function initDatagrid(){
	datagridObj = $('#1011050201');
	datagridObj.datagrid( {
		url : workflowDeployUrlRootPath.allList,
		idField:'deploymentId',
		pagination : true,
		rownumbers : true,
		fitColumns: true,
		//contentType:application/json,page rows->pageNo pageSize,sort order->orderBy,data->dataJSONString
		loader : function(param, success, error) { 
			datagridBeforeSend(param, success, error,$(this).datagrid("options"));
		 }, 
		columns : [ [ {
			field : 'ck',
		 	title : getLanguageValue('ck'),
			checkbox : true
		},{
			field : 'processId',
			title : getLanguageValue('workflow.processId'),
			width:$(this).width() * 0.14,
        	resizable:true,
			sortable : true,
			align : "center"
		},{
			field : 'processKey',
			title : getLanguageValue('workflow.processKey'),
			width:$(this).width() * 0.14,
        	resizable:true,
			sortable : true,
			align : "center"
		}, {
			field : 'processName',
			title : getLanguageValue('workflow.processName'), 
			width:$(this).width() * 0.17,
        	resizable:true,
			sortable : true,
			align : "center"
		}, {
			field : 'processVersion',
			title : getLanguageValue('workflow.processVersion'),
			width:$(this).width() * 0.07,
        	resizable:true,
			sortable : true,
			align : "center"
		},  {
			field : 'deploymentId',
			title : getLanguageValue('workflow.deploymentId'),
			width:$(this).width() * 0.08,
        	resizable:true,
			sortable : true,
			align : "center"
		}, {
			field : 'deploymentTime',
			title : getLanguageValue('workflow.deploymentTime'),
			width:$(this).width() * 0.14,
        	resizable:true,
			sortable : true,
			align : "center"
		},{
			field : 'appName',
			title : getLanguageValue('workflow.appName'), 
			width:$(this).width() * 0.14,
        	resizable:true,
        	align : "center",
			formatter:function(value,row){
				return value||row.appId;
			}
		} ] ],
		onDblClickRow:function(i,row) {
		}
	});	
	initDatagrigHeight('1011050201','queryDiv',$("#queryDiv").height());
}
/**
 * 描述：根据条件进行流程部署列表查询，查询按钮的响应方法。
 */
function queryInfo(){
	var query = $('#queryForm').serializeToJson();
	datagridObj.datagrid('options').queryParams=query; 
	datagridObj.datagrid('load'); 
}

/**
 * 查看流程图，弹出流程图显示页面
 **/
 function showWorkFlowChart() {
	var rows = datagridObj.datagrid("getSelections");
	if (rows.length == 1) {
		workflow.openWorkflowChart('processId='+rows[0].processId);
	} else {
		workflow.tipChooseRecored();
	}
}

/**
 * 部署流程
 */
var workflowDeployPath = workflowDeployRootPath.deploy;
function showDeployPage(){
	getDlg(workflowDeployPath.url, 
			workflowDeployPath.id, getLanguageValue(workflowDeployPath.key), 
			workflowDeployPath.w,workflowDeployPath.h);
}



