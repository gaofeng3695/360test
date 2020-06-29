
var resultList = [];  //各业务系统数据记录
var systemList =[];  //系统集合
var currentDataList = {total:0,rows:[],systemId:""};   //当前datagrid的数据源
var initPageNo = 1; //默认显示第一页
var initPageSize = 15; //默认显示15条数据
var currentPageNo = initPageNo;  //当前页
var currentPageSize = initPageSize; //当前页容量

/**
 * 初始化页面，加载页面数据。
 */
$(document).ready(function() {
	initData();
	initSystemList();
	initTaskDatagrid();
});


function initData(){
	$.ajax({
		url:rootPath+"/workflow/getTaskTracking.do",
		async:false,
		dataType:"json",
		success:function(result){
			resultList=result;
			if(resultList!=null && resultList.length>0){
				getDataListBySystemId(resultList[0].systemId,initPageNo,initPageSize);
			}
		}
	});
}

/**
 * 方法描述：初始化左侧系统列表
 */
function initSystemList(){
	for(var i=0; i<resultList.length;i++){
		var data = resultList[i];
		var obj = {id:data.systemId,text:data.systemName};
		systemList.push(obj);
	}
	$("#systemList").tree({
		data:systemList,
		onClick: function(node){
			//获取系统编号，根据系统编号获取值
			getDataListBySystemId(node.id,initPageNo,initPageSize);
			//重新加载taskDatagrid列表
			$('#tracklingTaskList').datagrid("loadData",currentDataList);
		}
	});
}


/**
 * 方法描述：根据系统编号获取系统分页信息
 * @param systemId
 */
function getDataListBySystemId(systemId, pageNo, pageSize){
	pageNo=pageNo||initPageNo;
	pageSize=pageSize||initPageSize;
	
	if (pageNo <= 1) {
		pageNo = initPageNo;
	}
	if (pageSize <= 1) {
		pageSize = initPageSize;
	}
	for(var i=0;i<resultList.length;i++){
		if(resultList[i].systemId==systemId){			
			currentDataList.systemId = resultList[i].systemId;
			if(resultList[i].success){
				var limit = pageSize;
				//在总记录中截取所需长度的记录
				var sumPage = Math.ceil(1.0*resultList[i].taskCount/limit);
				if(pageNo>sumPage){
					pageNo=sumPage;
				}
				var start = (pageNo - 1) * pageSize;
				
				if(start+limit>resultList[i].taskCount){
					currentDataList.rows = resultList[i].taskList.slice(start);
				}else{
					currentDataList.rows = resultList[i].taskList.slice(start,start+limit);
				}
				currentDataList.total=resultList[i].taskCount;
			}else{
				currentDataList.total=0;
				currentDataList.rows = [];
			}
			break;
		}
	}
}

function initTaskDatagrid(){
	$('#tracklingTaskList').datagrid({
		/*title : "流程跟踪列表",*/
		idField : 'taskId',
		pagination : true,
		rownumbers : true,
//		fitColumns:true,
		singleSelect:true,
		pageSize:initPageSize,
		data:currentDataList,
		columns : [ [ {
			field : 'ck',
			title : getLanguageValue('ck'),
			checkbox : true
		}, {
			field : 'taskId',
			title : getLanguageValue('taskId'),
			width : 80,
			align:"center"
		}, {
			field : 'taskName',
			title : getLanguageValue('taskName'),
			width : 200,
			sortable : true,
			align:"center"
		},{
			field : 'procName',
			title : "流程名称",
			width : 100,
			align:"center"
		},{
			field : 'procInstId',
			title : "流程实例ID",
			width : 100,
			align:"center"
		},{
			field : 'subject',
			title : "主题",
			width : 200,
			align:"center"
		}, {
			field : 'startTime',
			title : "任务开始时间",
			width : 160,
			align:"center"
		}, {
			field : 'approveTime',
			title : "审批时间",
			width : 150,
			align:"center"
		}, {
			field : 'nextTaskName',
			title : "节点名称",
			width : 120,
			align:"center"
		}, {
			field : 'nextApprover',
			title : "代办人",
			width : 120,
			align:"center"
		},{
			field : 'status',
			title : "流程状态",
			width : 100,
			align:"center"
		},{
			field : 'systemId',
			title : "系统编号",
			width : 100,
			align:"center"
		},{
			field : 'systemName',
			title : "系统名称",
			width : 160,
			align:"center"
		},{
			field : 'viewUrl',
			title : "页面Url",
			hidden:true,
			width : 160
		} ] ],
		onBeforeLoad:function(param){
			currentPageNo = param.page;
			currentPageSize = param.rows;
			//获取分页信息
			getDataListBySystemId(currentDataList.systemId,currentPageNo,currentPageSize);
			//重新加载taskDatagrid列表
			$('#tracklingTaskList').datagrid("loadData",currentDataList);
		},
		onDblClickRow : function(i, row) {
			window.open(row.viewUrl);
			//top.getDlg(row.viewUrl, 'viewUI',"详情页面", 900, 550);
		}
	});
	initDatagrigHeight('tracklingTaskList', '', '30',"taskInfo");
}
