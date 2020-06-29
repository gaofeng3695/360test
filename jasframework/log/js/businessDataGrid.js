$(document).ready(function() {
	$("#loginLogTable").datagrid({
		onDblClickRow : function(index, row) {
			$('#loginLogTable').datagrid('selectRow', index); // 指定行选中
			var eventID = row.eventid;
			top.getDlg("businessInfo.htm?eventid=" + eventID,"viewiframe", "查看", 500, 110);
		},
		onClickRow:function(i,row) {
			buttonAttr();
			approveButtonAttr();
		},
		onSelect:function(i,row) {
			buttonAttr();
			approveButtonAttr();
		},
		onCheck:function(i,row) {
			buttonAttr();
			approveButtonAttr();
		},
		onUncheck:function(i,row) {
			buttonAttr();
			approveButtonAttr();
		},
		onSelectAll:function(i,row) {
			buttonAttr();
			approveButtonAttr();
		},
		onUnselectAll:function(i,row) {
			buttonAttr();
			approveButtonAttr();
		}
	});
	initDatagrigHeight('loginLogTable');

});
function buttonAttr(){
	var rows = $("#loginLogTable").datagrid('getSelections');
	var filedAtt = false;
	if (rows.length > 0){
		for(var i=0;i<rows.length;i++){
			if(filedAtt){
				break;
			}
//			var eventID = rows[0].eventid;
//			isExistsWorkflow(eventID,function(result){
//				if(result.success){
//					if(result.isExists == 0){
//						filedAtt = false;
//					}else if(result.isExists == 1){
//						filedAtt = true;
//					}
//				}
//			});
		}
	}
	if( filedAtt ){
		$('#10130504').linkbutton('disable');
		$('#10130505').linkbutton('disable');
		$('#10130503').linkbutton('disable');
		$('.workflo').linkbutton('disable');
	}else{
		$('#10130504').linkbutton('enable');
		$('#10130505').linkbutton('enable');
		$('#10130503').linkbutton('enable');
		$('.workflo').linkbutton('enable');
	}
}
var taskId;
function approveButtonAttr(){
	var rows = $("#loginLogTable").datagrid('getSelections');
	var filedAtt = false;
	if (rows.length == 1){
		var eventID = rows[0].eventid;
		var userId = "40288add3a100094013a100319e80002";
//		isCanApprove(eventID,userId,function(result){
//			if(result.success==1){
//				if(result.canApprove == 1){
//					filedAtt = true;
//					taskId = result.taskId;
//				}else if(result.canApprove == -1){
//					filedAtt = false;
//				}
//			}
//		});
	}
	if(filedAtt){
		$('#approveButtton').linkbutton('enable');
	}else{
		$('#approveButtton').linkbutton('disable');
	}
}
/**
 * 描述：任务审批
 */
function approve(){
 	var rows = $("#loginLogTable").datagrid("getSelections");
	if (rows.length == 1 ){
		top.getDlg("../workflow/approveUI.htm?taskId="+taskId+"&businessEventId="+rows[0].eventid
				+"&r="+new Date().getTime(),'approveUI','办理工作',900,600);
	}else{
		top.showAlert(getLanguageValue("tip"),getLanguageValue("chooserecord"),'info');
		return;
	}
}

function sel() {
	var rows = $('#loginLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#loginLogTable').datagrid('getSelected');
		var eventID = row.eventid;
		top.getDlg("businessInfo.htm?eventid=" + eventID, "viewiframe", "查看",
				500, 210);
	} else {
		$.messager.alert('提示', '请选中一条记录', 'info');
	}
}

function add() {
	top.getDlg("businessForm.htm", "businessAdd", getLanguageValue('add'), 600, 200);
}

function upda() {
	var rows = $('#loginLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#loginLogTable').datagrid('getSelected');
		var eventID = row.eventid;
		top.getDlg("businessForm.htm?eventid=" + eventID, "businessUpdate", "更新",
				 600, 200);
	} else {
		$.messager.alert('提示', '请选中一条操作日志记录', 'info');
	}
}

function dele() {
	var rows = $('#loginLogTable').datagrid('getSelections');

	if (rows.length <= 0) {
		$.messager.alert('提示', '请选择要删除的抢维修记录!', 'info');
	} else {
		$.messager.confirm('提示', '你确定要删除当前记录吗?', function(r) {
			if (r) {
				goDeleRoles();
			}
		});
	}
}

// 开始删除
function goDeleRoles() {
	var rows = $('#loginLogTable').datagrid('getSelections');

	var jsonIds = arrayTojson(rows);

	$.ajax({
		type : "get",
		url : "../logsample/deleteBusiness.do",
		data : {
			jsonIds : jsonIds
		},
		success : function(msg) {
			$('#loginLogTable').datagrid('reload');
		}
	});

}

// id数组转换为json字符串
function arrayTojson(arr) {
	var jsonIds = "[";
	for ( var i = 0; i < arr.length; i++) {
		if (i == arr.length - 1) {
			jsonIds += arr[i].eventid;
		} else {
			jsonIds += arr[i].eventid + ",";
		}
	}
	jsonIds += "]";

	return jsonIds;
}

function update() {
   
}

function export1() {
	$("#exprotPlanframe").attr("src", "../logsample/exportBusiness.do");

	// $.post("../logsample/exportBusiness.do");
}
var businessEventId = 1001 - Math.round(Math.random() * 10)
		* Math.round(Math.random() * 10) * Math.round(Math.random() * 10);
var comment = "动态指定办理人流程意见...";
businessEventId += "applyOne";
var workflowName = "applyOne";
var subject = "动态指定办理人流程主题";
//var map = new Map();
//map.put("normalRole","normalRole");
// 是否含有发起用户变量
// var applyUserFlag = true;
// 发起工作流
function audit(){
	var rows = $('#loginLogTable').datagrid('getSelections');
	if (rows.length == 1) {
		var row = $('#loginLogTable').datagrid('getSelected');
		var eventID = row.eventid;
		startWorkflow(eventID, workflowName,subject, comment,false, callbackFun,map);
	} else {
		$.messager.alert('提示', '请选中一条记录', 'info');
	}

}
/**
 * 流程图
 */
function getWorkFlowChart() {
	// 流程图弹出页面，url需要根据页面所在位置作相应的调整
	top.getDlg('../../../workflow/workflow.htm?businessEventId='
			+ businessEventId + "&r=" + new Date().getTime(), '', '流程图', 800,
			600);
}
/**
 * 流程图
 */
function runqianReport() {
	top.getDlg(rootPath+'/reportJsp/showReport.jsp?raq=wanggeshiReport.raq', "businessAdd", '报表', 800, 600);
}
	// 流程图弹出页面，url需要根据页面所在位置作相应的调整
// 回调函数
function callbackFun(result) {
	if (result.success) {
		$.messager.alert('正确', result.ok, 'ok', function() {
			approveButtonAttr();
		});
	} else {
		$.messager.alert('错误', result.msg, 'error');
	}
	
}