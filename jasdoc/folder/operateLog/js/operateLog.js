$(function() {	
	

	$("#beginDate").datetimebox({
		width : document.documentElement.clientWidth * 0.35
	});
	$("#endDate").datetimebox({
		width : document.documentElement.clientWidth * 0.35
	});

	$('#operateLogTable').datagrid({
		width:'100%',
		nowrap: false,
		striped: true,
		collapsible:false,
		url:rootPath+"jasdoc/operateLogSon/getAll.do",
		remoteSort: true,
		idField:'oid',
		pagination:true,
		rownumbers:true,
		toolbar:'#toolbar',
		title:"文档操作日志",
	 	columns:[[
	           {field:'ck',title:'全选',checkbox:true}, 
	           {field:'businessName',title:'业务模块',width:200},
	           {field:'createUserName',title:'操作人',width:200} ,
	           {field:'optType',title:'操作类型',width:200},
	           {field:'createTime',title:'操作时间',width:200}
	          ] ]
	});	
	initDatagrigHeight('operateLogTable', 'searchpanel', 100);
});


function operateLogExecuteQuery() {
	var username = $("#username").val();
	var businessname = $("#businessname").val();
	var beginDate = $("#beginDate").datetimebox('getText');
	var endDate = $("#endDate").datetimebox('getText');

	if ("" != beginDate && "" != endDate) {
		if (!comptime(beginDate, endDate)) {
			alert('开始时间大于结束时间,请重新选择！');
			return false;
		}
	}
	var query={"username":username,"businessname":businessname,"beginDate":beginDate,"endDate":endDate};
	var url= rootPath+"jasdoc/operateLogSon/getAll.do";
	$("#operateLogTable").datagrid("options").url = url;
	$("#operateLogTable").datagrid('options').queryParams=query;
	$("#operateLogTable").datagrid('load');	
	$("#operateLogTable").datagrid('options').queryParams=null;

}

function operateLogClearAll() {
	$("#username").val("");
	$("#businessname").combobox("clear");
	$("#operatetype").combobox('setValue', "");
	$("#beginDate").datetimebox('setText', '');
	$("#endDate").datetimebox('setText', '');
}

function viewLog() {
	var rows = $('#operateLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#operateLogTable').datagrid('getSelected');
		getDlg("viewLog.htm?eventid="+row.oid, "viewLog", "查看", 500, 310);

	} else {
		$.messager.alert('提示', '请选中一条操作日志记录', 'info');
	}
}

function comptime(beginTime, endTime) {
	var beginTimes = beginTime.substring(0, 10).split('-');
	var endTimes = endTime.substring(0, 10).split('-');

	beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
	endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);

	var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
	if (a < 0) {
		return false;
	} else if (a > 0) {
		return true;
	} else if (a == 0) {
		return true;
	} else {
		return false;
	}
}
