$(function() {
	initDatagrigHeight('chartTable', 'searchpanel', 58);

	$("#charttype").combobox({
		url:rootPath + "/jasframework/sysdoman/getsysdoman.do?domainname="+"charttype",
		valueField:"codeid",
		textField:"codename"
	});
	$("#businesstablename").combobox({
		url:rootPath + "/jasframework/statisticalchart/getAllViewName.do",
		valueField:"VIEW_NAME",
		textField:"VIEW_NAME"
	});
	setComboObjWidth("charttype",0.35,"combobox","");
	setComboObjWidth("businesstablename",0.35,"combobox","");
	$("#chartTable").datagrid({
		url:rootPath + "/jasframework/statisticalchart/queryChartConfig.do",
		rownumbers:true,
		pagination:true,
		nowrap:true,
		toolbar:"#tb",   
		columns:[[
             {field:'ck',checkbox:true},
             {field:'businesstablename',title:'<span key="" class="paltform-i18n">业务表名</span>',width:300},
             {field:'methodname',title:'<span key="syslog.methodname" class="paltform-i18n">方法名</span>',width:150},
             {field:'chartname',title:'<span key="" class="paltform-i18n">统计图名</span>',width:150},
             {field:'charttype',title:'<span key="" class="paltform-i18n">统计图类型</span>',width:300},
          ]],
		onDblClickRow : function(index, row) {
			$('#chartTable').datagrid('selectRow', index); // 指定行选中
			var eventID = row.eventid;
			top.getDlg("previewchart.htm?eventid=" + eventID, "systemView", "查看",
					800, 500);
		}
	});
});

function chartQuery() {
	var chartname = $("#chartname").val();
	var charttype = $("#charttype").combobox('getValue'); 
	var businesstablename = $("#businesstablename").combobox('getValue'); 


	$('#chartTable').datagrid('load', {
		chartname : chartname,
		charttype : charttype,
		businesstablename : businesstablename
	});
}
function viewChart(){
	var rows = $('#chartTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#chartTable').datagrid('getSelected');
		var eventID = row.eventid;
		top.getDlg("previewchart.htm?eventid=" + eventID, "systemView", "查看",
				800, 500);
	} else {
		$.messager.alert('提示', '请选中一条记录', 'info');
	}
}
//更新
function updateChart() {
	var rows = $('#chartTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#chartTable').datagrid('getSelected');
		var eventID = row.eventid;
		top.getDlg("addAndUpdateChart.htm?eventid=" + eventID, "saveiframe", "修改",
				700, 650);
	} else {
		$.messager.alert('提示', '请选中一条记录', 'info');
	}
}
//删除
function removeChart(){
	var rows = $('#chartTable').datagrid('getSelections');
	if (rows.length > 0) {
		var arr=new Array(); 
		for(var i=0;i<rows.length;i++){
			arr[i] = rows[i].eventid;
		}
		$.ajax({ 
			   type: "POST",
			   url:rootPath + "/jasframework/statisticalchart/deleteChartConfig.do?random="+new Date(),
			   data: {"eventid":arr+""},
			   success: function(data){
				   data = eval('('+data+')');
				   top.showAlert("提示", data.tip, 'info', function() {
					   $("#chartTable").datagrid("reload");
//						reloadData('sysStatisticalchart.htm', '#chartTable');
					});
			   }
			});
	} else {
		$.messager.alert('提示', '请选中记录', 'info');
	}
}
//收藏为我的图表
function addMyChart(){
	var rows = $('#chartTable').datagrid('getSelections');
	if (rows.length > 0) {
		var arr=new Array(); 
		for(var i=0;i<rows.length;i++){
			arr[i] = rows[i].eventid;
		}
		$.ajax({ 
			   type: "POST",
			   url:rootPath + "/jasframework/statisticalchart/saveChartUserRel.do?random="+new Date(),
			   data: {"eventid":arr+""},
			   success: function(data){
				   data = eval('('+data+')');
				   top.showAlert("提示", data.tip, 'info', function() {
					   $("#chartTable").datagrid("reload");
//						reloadData('sysStatisticalchart.htm', '#chartTable');
					});
			   }
			});
	} else {
		$.messager.alert('提示', '请选中记录', 'info');
	}
}

function chartClearAll() {
	$("#chartname").val('');
	 $("#charttype").combobox('setValue',"");
	 $("#businesstablename").combobox('setValue',"");
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
function addChart(){
	top.getDlg("addAndUpdateChart.htm" , "saveiframe", "新增",
			800, 750);
}


function getChart(){
	top.getDlg("myStatisticalchart.htm" , "saveiframe", "新增",
			800, 750);
}
