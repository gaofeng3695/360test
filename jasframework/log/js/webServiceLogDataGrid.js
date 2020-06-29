$(function() {
	
	$('#dg').datagrid({
		url:"../webServiceLog/getAll.do",
		idField:"eventid",
		toolbar:"#toolbar",
		rownumbers:true,
		pagination:true,
		nowrap:true,
		title:"系统服务日志",
		 columns:[[    
		           {field:'serviceModule',title:'服务模块',width:200},    
		           {field:'serviceName',title:'服务名称',width:100},    
		           {field:'serviceDesc',title:'服务描述',width:200} ,
		           {field:'userName',title:'操作人',width:100} ,
		           {field:'operateTime',title:'操作时间',width:200} ,
		           {field:'systemNumber',title:'系统编号',width:200,hidden:true} ,
		           {field:'systemName',title:'系统名称',width:200} ,
		           {field:'detailInfo',title:'详情',width:300} 
		       ]] 
	});
	
	initDatagrigHeight('dg', 'searchpanel', 85);
	
	$("#beginDate").datetimebox({
		width : document.documentElement.clientWidth * 0.35
	});
	$("#endDate").datetimebox({
		width : document.documentElement.clientWidth * 0.35
	});
	$('#systemNumber').combobox({   
		 url:rootPath+"/jasframework/appsystem/getUserAppsystem.do",
		 valueField:'appnumber',   
		 textField:'name' ,
		 panelHeight:"auto"
		}); 
	setComboObjWidth('systemNumber',0.35,'combobox','');
});


function executeQuery() {
	var userName = $("#userName").val();
	var serviceModule = $("#serviceModule").val();
	var systemNumber = $("#systemNumber").combobox('getValue');
	var beginDate = $("#beginDate").datetimebox('getText');
	var endDate = $("#endDate").datetimebox('getText');

	if ("" != beginDate && "" != endDate) {
		if (!comptime(beginDate, endDate)) {
			alert('开始时间大于结束时间,请重新选择！');
			return false;
		}
	}
	var query={"operator":userName,"serviceModule":serviceModule,"systemNumber":systemNumber,"beginDate":beginDate,"endDate":endDate};

	$("#dg").datagrid('options').queryParams=query;
	$("#dg").datagrid('load');
	
}


function viewLog() {
	var rows = $('#dg').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#dg').datagrid('getSelected');
		var eventid = row.eventid;
		getDlg("viewWebServiceLog.htm?eventid="+eventid, "viewLog", "查看", 500, 310);

	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}

function clearAll(){
	$("#userName").val("");
	$("#systemNumber").combobox("clear");
	$("#serviceModule").val('');
	$("#beginDate").datetimebox('setText', '');
	$("#endDate").datetimebox('setText', '');
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
