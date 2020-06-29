$(function() {
	
	$('#operateLogTable').datagrid({
		onSelect : function(rowIndex, rowData) {
			if (rowData.operatetype == 4) {
				$('#comp_but').linkbutton('disable');
				$('#sel_but').linkbutton('disable');
				
			} else if (rowData.operatetype == 2) {
				$('#comp_but').linkbutton('enable');
				$('#sel_but').linkbutton('enable');
			} else {
				$('#comp_but').linkbutton('disable');
				$('#sel_but').linkbutton('enable');
			}
		}
	});
	
	initDatagrigHeight('operateLogTable', 'searchpanel', 85);
	
	$("#businessname").combobox({
		width : document.documentElement.clientWidth * 0.35
	});
	$("#beginDate").datetimebox({
		width : document.documentElement.clientWidth * 0.35
	});
	$("#endDate").datetimebox({
		width : document.documentElement.clientWidth * 0.35
	});
	$("#operatetype").combobox({
		width : document.documentElement.clientWidth * 0.35
	});
	
	onWindowResize.add(function(){
		$("#businessname").combobox({
			width : document.documentElement.clientWidth * 0.35
		});
		$("#beginDate").datetimebox({
			width : document.documentElement.clientWidth * 0.35
		});
		$("#endDate").datetimebox({
			width : document.documentElement.clientWidth * 0.35
		});
		$("#operatetype").combobox({
			width : document.documentElement.clientWidth * 0.35
		});
	});
});


function compare() {
	var rows = $('#operateLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#operateLogTable').datagrid('getSelected');
		if (row.operatetype == 2) {
			var eventID = row.eventid;
			top.getDlg("comporeDataGrid.htm?eventid=" + eventID, "viewiframe",getLanguageValue("operatelog.compare"), 500, 310);
		} else {
			top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		}

	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
	}
}

function operateLogExecuteQuery() {
	var username = $("#username").val();
	var businessname = $("#businessname").combobox('getValue');
	var operatetype = $("#operatetype").combobox('getValue');
	var beginDate = $("#beginDate").datetimebox('getText');
	var endDate = $("#endDate").datetimebox('getText');

	if ("" != beginDate && "" != endDate) {
		if (!comptime(beginDate, endDate)) {
			alert('开始时间大于结束时间,请重新选择！');
			return false;
		}
	}

	$('#operateLogTable').datagrid('load', {
		username : username,
		businessname : businessname,
		operatetype : operatetype,
		beginDate : beginDate,
		endDate : endDate
	});
}

function operateLogClearAll() {
	$("#username").val("");
	$("#businessname").combobox("clear");
	$("#operatetype").combobox('setText', "全部");
	$("#operatetype").combobox('setValue', "");
	$("#beginDate").datetimebox('setText', '');
	$("#endDate").datetimebox('setText', '');
}

function sele() {
	var rows = $('#operateLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#operateLogTable').datagrid('getSelected');
		var businessname = row.businessname;
		// 转码
		businessname = encodeURI(row.businessname);
		var eventID = row.tableeventid;
		$.get("../operateLog/getUrl.do", {
			businessname : businessname
		}, function(result) {
			var url = result.replace(/\"/g, "") + "?eventid=" + eventID+"&if_his_select="+1;
			top.getDlg(url, "viewiframe", getLanguageValue("view"), 500, 310);
		});

	} else {
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
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
