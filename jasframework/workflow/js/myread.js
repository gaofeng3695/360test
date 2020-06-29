/**
 * 
 * 类描述: 已阅工作功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2012-12-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */

var datagridID = "myReadWorkDatagrid";
var datagridObj;
var refreshPageParams="refreshPage=myread.htm&refreshPageDatagrid="+datagridID;
/**
 * 初始化页面，加载页面数据。
 */
$(document).ready(function(){
	//初始化查询条件
	initQueryCondition();
	//初始化数据列表
	initDatagrid();
});

/**
 * 描述：初始化查询条件
 */
function initQueryCondition(){
	
}
/**
 * 描述：初始化数据列表
 */
function initDatagrid(){
	datagridObj = $('#'+datagridID);
	datagridObj.datagrid( {
		url:workflow.URL.carbon.myDoneList,
		idField:'oid',
		pagination:true,
		rownumbers:true,
		singleSelect:true,
		fitColumns: true,
		//contentType:application/json,page rows->pageNo pageSize,sort order->orderBy,data->dataJSONString
		loader : function(param, success, error) { 
			datagridBeforeSend(param, success, error,$(this).datagrid("options"));
		 },
		columns:[[
			{field:'ck',title:getLanguageValue('ck'),checkbox:'true',width:100},
		    {field:'oid',title:"oid",width:180,hidden:true},
		    {
				field : 'processName',
				title : getLanguageValue('workflow.processName'),
				width:$(this).width() * 0.125,
	        	resizable:true,
				align:"center",
				hidden:false,
			},{
				field : 'proInstName',
				title : getLanguageValue('workflow.proInstName'),
				width:$(this).width() * 0.125,
	        	resizable:true,
	        	align:"center"
			},{
				field : 'taskId',
				title : getLanguageValue('workflow.taskName')+"/"+getLanguageValue('workflow.taskId'),
				width:$(this).width() * 0.125,
	        	resizable:true,
	        	align:"center",
				sortable : true,
				formatter:function(value,row){
					return row.taskName+" ("+row.taskId+")";
				}
			},
			{field:'reply',title:getLanguageValue('workflow.carbonReply'),width:$(this).width() * 0.125,
	        	resizable:true,align:"center",
				formatter:function(value,row){
					if(!value){
						return "-";
					}
					return "<span style='color:#59B6FC'>"+value+"</span>";
				}
			},
			{field:'replyDatetime',title:getLanguageValue('workflow.carbonReplyDatetime'),width:$(this).width() * 0.14,
	        	resizable:true,align:"center"},
		    {field:'userName',title:getLanguageValue('workflow.carbonUserName'),width:$(this).width() * 0.125,
		        	resizable:true,align:"center"},
		    {field:'createDatetime',title:getLanguageValue('workflow.carbonCopytime'),width:$(this).width() * 0.14,
			        	resizable:true,sortable:true,align:"center"},
		    {field:'remark',title:getLanguageValue('workflow.carbonRemark'),width:$(this).width() * 0.125,
				        	resizable:true,align:"center"},
		    {
				field : 'businessKey',
				title : getLanguageValue('workflow.businessKey'),
				width : 150,
				hidden : true
			},
			{
				field : 'processKey',
				title : getLanguageValue('workflow.processKey'), 
				width : 150,
				hidden : true
			}
		]],
		onDblClickRow:function(rowNum,row){
		}
	});
	initDatagrigHeight(datagridID,'',0);
}

/**
 * 查看流程图，弹出流程图显示页面窗口
 */
 function showWorkFlowChart() {
	var rows = datagridObj.datagrid("getSelections");
	if (rows.length == 1) {
		top.getDlg(workflow.page.workflowChart.url+'?proInstId='+rows[0].proInstId, workflow.page.workflowChart.id, getLanguageValue("workflow.workflowChart"), 800, 600);
	} else {
		top.showAlert(getLanguageValue("tip"), getLanguageValue("chooserecord"), 'info');
	}
}
 /**
  * 查看流程历史审批记录，弹出历史审批记录页面窗口
  */
 function showApproveHistory() {
 	var rows = datagridObj.datagrid("getSelections");
 	if (rows.length == 1) {
 		top.getDlg(workflow.page.workflowHistory.url+'?proInstId='+rows[0].proInstId+"&businessKey="+rows[0].businessKey, workflow.page.workflowHistory.id,
 				getLanguageValue("workflow.approveHistory"), 800, 441);
 	} else {
 		top.showAlert(getLanguageValue("tip"), getLanguageValue("chooserecord"), 'info');
 	}
 }