$(function() {


	$("#beginDate").datetimebox({
		width : document.documentElement.clientWidth * 0.35
	});
	$("#endDate").datetimebox({
		width : document.documentElement.clientWidth * 0.35
	});
	
	onWindowResize.add(function(){
		$("#beginDate").datetimebox({
			width : document.documentElement.clientWidth * 0.35
		});
		$("#endDate").datetimebox({
			width : document.documentElement.clientWidth * 0.35
		});
	});//要使用该方法
	
	$("#systemLogTable").datagrid({
		onDblClickRow : function(index, row) {
			$('#systemLogTable').datagrid('selectRow', index); // 指定行选中
			var eventID = row.eventid;
			top.getDlg("systemLogInfo.htm?eventid=" + eventID, "systemView", "查看",
					600, 400,false,true,true);
		}
	});
	initDatagrigHeight('systemLogTable', 'searchpanel', 58);
});

function systemLogExecuteQuery() {
	var beginDate = $("#beginDate").datetimebox('getText');
	var endDate = $("#endDate").datetimebox('getText');

	if ("" != beginDate && "" != endDate) {
		if (!comptime(beginDate, endDate)) {
			alert('开始时间大于结束时间,请重新选择！');
			return false;
		}
	}

	$('#systemLogTable').datagrid('load', {
		beginDate : beginDate,
		endDate : endDate
	});
}

function select() {
	var rows = $('#systemLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#systemLogTable').datagrid('getSelected');
		var eventID = row.eventid;
		top.getDlg("systemLogInfo.htm?eventid=" + eventID, "systemView",getLanguageValue("view"),
				600, 400,false,true,true);
	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}

function systemLogClearAll() {
	$("#beginDate").datetimebox('setText', '');
	$("#endDate").datetimebox('setText', '');
}

function comptime(beginTime, endTime) {
	var beginTimes = beginTime.substring(0, 10).split('-');
	var endTimes = endTime.substring(0, 10).split('-');

	beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' '
			+ beginTime.substring(10, 19);
	endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' '
			+ endTime.substring(10, 19);

	var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
	if (a < 0) {
		return false;
	} else if (a > 0) {
		return true;
	} else if (a == 0) {
		return true;
	} else {
		alert("exception");
		return false;
	}
}
