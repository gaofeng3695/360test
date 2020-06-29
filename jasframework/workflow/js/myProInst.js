/**
 * 
 * 类描述: 我发起的流程功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2012-12-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */
var workflowInstanceUrlRootPath = workflow.URL.instance; //流程实例后台请求根路径

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
	//初始化流程名称列表下拉选
	workflow.getWorkflowNameList(function(result){
		workflow.loadWorkflowName("processKey",result.rows);
	});
	//高级搜索
	workflow.moreQueryHandler(datagridID);
}

/**
 * 描述：初始化数据列表
 */
var datagridID = "1011070201";
var datagridObj;
function initDatagrid(){
	datagridObj = $('#'+datagridID);
	datagridObj.datagrid( {
		url : workflowInstanceUrlRootPath.myList,
		idField:'proInstId',
		pagination : true,
		rownumbers : true,
		singleSelect:true,
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
			field : 'proInstId',
			title : getLanguageValue('workflow.proInstId'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			hidden : false,
			sortable : true
		}, {
			field : 'proInstName',
			title : getLanguageValue('workflow.proInstName'),
			width:$(this).width() * 0.14,
        	resizable:true,
			sortable : false,
			align:"center"
		},  {
			field : 'businessKey',
			title : getLanguageValue('workflow.businessKey'),
			width : 150,
			hidden : true
		}, {
			field : 'startTime',
			title : getLanguageValue('workflow.proInstStartTime'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			sortable : true
		}, {
			field : 'status',
			title : getLanguageValue('workflow.proInstStatus'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
		},
		 {
			field : 'currentTasks',
			title : getLanguageValue('workflow.proInstExecution'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			formatter:function(value,row){
				var formmater=row.endTime || "";
				if(formmater!=""){
					return formmater+" <br/><span style='color:#818a91;font-size:10px;line-height:18px;'>( "+getLanguageValue("workflow.proInstDuration")+": "+millsToHmsConverter(row.duration)+" )";
				}
				var currentTasks = row.currentTasks;
				if(currentTasks.length==0){
					return "";
				}
				for(var i=0;i<currentTasks.length;i++){
					var item = currentTasks[i];
					var fontColor = "#59B6FC"
					if(!(item.approveUserName||"")){
						fontColor = "#f3703c";
					}
					formmater = "| "+(item.taskName||"")+" : <span style='font-size:10px;color:"+fontColor+"'>"+(item.approveUserName||getLanguageValue("workflow.noperson")+"</span>");
				}
				formmater = formmater.substring(1);
				return formmater;
			}
		},{
			field : 'processName',
			title : getLanguageValue('workflow.processName'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			sortable : false,
			hidden:false,
		},
		{
			field : 'processVersion',
			title : getLanguageValue('workflow.processVersion'),
			width:$(this).width() * 0.14,
        	resizable:true,
			align:"center",
			sortable : false,
			formatter:function(value,row){
				return value;
			}
		},{
			field : 'processId',
			title : getLanguageValue('workflow.processId'),
			width : 120,
			hidden : true
		},{
			field : 'deleteReason',
			title : getLanguageValue('deleteReason'),
			width : 200,
			hidden : true
		} ] ],
		onDblClickRow:function(rowNum,row){
		}
	});	
	initDatagrigHeight(datagridID,'queryDiv',64);
}

/**
 * 根据输入的查询条件进行流程实例数据查询
 */
function queryData(){
	var query = $('#queryForm').serializeToJson();
	//处理时间格式：将时间转换为毫秒数
	query.startTimeBegin = datetimeToMillsConverter(query.startTimeBegin);
	query.startTimeEnd = datetimeToMillsConverter(query.startTimeEnd);
	query.endTimeBegin = datetimeToMillsConverter(query.endTimeBegin);
	query.endTimeEnd = datetimeToMillsConverter(query.endTimeEnd);
	//处理关键字查询
	query.proInstName = (query.proInstName||"")!=""?"%"+query.proInstName+"%":"";
	datagridObj.datagrid('options').queryParams=query; 
	datagridObj.datagrid('load'); 
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

function refresh(){
	datagridObj.datagrid('reload');
}