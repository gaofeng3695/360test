/**
 * 
 * 类描述: 委托功能js。
 *
 * @author zhaojz
 * @version 1.0
 * 创建时间： 2012-12-30 上午8:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：         修改人：
 * 修改内容： 
 **********************************************************************
 */
var delegatePageRootPath = workflow.page.delegate;  //工作委托页面根路径
var delegateUrlRootPath = workflow.URL.delegate; //工作委托后台请求根路径
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
	//高级搜索
	workflow.moreQueryHandler(datagridID);
}

/**
 * 描述：初始化datagrid数据
 */
var datagridID = "1011080201";
var datagridObj;
function initDatagrid(){
	datagridObj = $('#'+datagridID);
	datagridObj.datagrid( {
		url : delegateUrlRootPath.myList,
		idField:'oid',
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
			field : 'userName',
			title : getLanguageValue('workflow.delegateUserName'),
			width : 150,
			hidden  : true
		}, {
			field : 'delegateUserName',
			title : getLanguageValue('workflow.delegateToUserName'),
			width:$(this).width() * 0.16,
        	resizable:true,
			align : "center"
		}, {
			field : 'delegateType',
			title : getLanguageValue('workflow.delegateType'), 
			width : 150,
			hidden  : true
		},  {
			field : 'startTime',
			title : getLanguageValue('workflow.delegateStartTime'),
			width:$(this).width() * 0.16,
        	resizable:true,
			sortable : true,
			align : "center"
		}, {
			field : 'endTime',
			title : getLanguageValue('workflow.delegateEndTime'),
			width:$(this).width() * 0.16,
        	resizable:true,
			sortable : true,
			align : "center"
		},{
			field : 'remark',
			title : getLanguageValue('workflow.remark'),
			width:$(this).width() * 0.16,
        	resizable:true,
			align : "center"
		} ,{
			field : 'status',
			title : getLanguageValue('workflow.delegateStatus'),
			width:$(this).width() * 0.16,
        	resizable:true,
			align : "center",
			formatter:function(value,row){
				return delegateStatusFormatter(value);
			}
		}, {
			field : 'createDatetime',
			title : getLanguageValue('workflow.createDatetime'),
			width:$(this).width() * 0.16,
        	resizable:true,
			sortable : true,
			align : "center"
		},  {
			field : 'delegateRoleName',
			title : getLanguageValue('workflow.delegateToUserRoleName'),
			width : 150,
			hidden  : true
		}  ] ],
		onClickRow:function(i,row) {
			buttonStatus(datagridObj);
		},
		onSelect:function(i,row) {
			buttonStatus(datagridObj);
		},
		onCheck:function(i,row) {
			buttonStatus(datagridObj);
		},
		onUncheck:function(i,row) {
			buttonStatus(datagridObj);
		},
		onSelectAll:function(i,row) {
			buttonStatus(datagridObj);
		},
		onUnselectAll:function(i,row) {
			buttonStatus(datagridObj);
		},
		onDblClickRow:function(rowNum,row){
		},
		onLoadSuccess:function(data){
			isExistsDelegate();
			
		}
	});	
	initDatagrigHeight(datagridID,'queryDiv',64);
}
/**
 * 格式化委托状态
 * @param status
 * @returns
 */
function delegateStatusFormatter(status){
	if("1"==status){
		return "<span style='color:#59b6fc'>委托中</span>";
	}
	if("-1"==status){
		return "<span style='color:#CBCBCB'>已结束</span>";
	}
	if("-2"==status){
		return "<span style='color:#f3703c'>已取消</span>";
	}
	return "-";
}
/**
 * 描述：判断按钮置灰条件,并根据条件改变按钮可用状态
 * @param datagridObj datagrid对象
 */
function buttonStatus(datagridObj){
	var rows = datagridObj.datagrid('getSelections');
	var buttonEnalbe = true;
	if (rows.length > 0){
		for(var i=0;i<rows.length;i++){
			if( rows[i].status != 1 ){
				buttonEnalbe = false;
				break;
			}
		}
	}
	if(buttonEnalbe){
		$('#101108020103').linkbutton('enable');
		$('#101108020104').linkbutton('enable');
	}else{
		$('#101108020103').linkbutton('disable');
		$('#101108020104').linkbutton('disable');
	}
}

/**
 * 描述：判断是否已经存在流程任务代理，如果存在，则将新增按钮置为不可用状态
 */
function isExistsDelegate(){
	workflow.isExistDelegate({},function(result){
		if(result.status==-1 || result.data==true){
			$('#101108020102').linkbutton('disable');
		}else{
			$('#101108020102').linkbutton('enable');
		}
	})
}
/**
 * 刷新页面
 * @returns
 */
function refresh(){
	datagridObj.datagrid("reload");
}
/**
 * 根据输入的查询条件进行数据查询
 */
function queryData(){
	var query = $('#queryForm').serializeToJson();
	//处理时间格式：将时间转换为毫秒数
	query.startTimeBegin = datetimeToMillsConverter(query.startTimeBegin);
	query.startTimeEnd = datetimeToMillsConverter(query.startTimeEnd);
	query.endTimeBegin = datetimeToMillsConverter(query.endTimeBegin);
	query.endTimeEnd = datetimeToMillsConverter(query.endTimeEnd);
	query.createTimeBegin = datetimeToMillsConverter(query.createTimeBegin);
	query.createTimeEnd = datetimeToMillsConverter(query.createTimeEnd);
	//设置委托状态
	query.status = (query.status||"")==""?[]:[query.status];
	datagridObj.datagrid('options').queryParams=query; 
	datagridObj.datagrid('load'); 
}

/**
 * 弹出委托信息显示页面窗口
 */
var viewDelegatePath = delegatePageRootPath.view;
function showViewPage(){
	var rows = datagridObj.datagrid('getSelections');
	if (rows.length == 1){
		top.getDlg(viewDelegatePath.url+"?pkfield="+rows[0].oid,
				viewDelegatePath.id,getLanguageValue(viewDelegatePath.key),
				viewDelegatePath.w,viewDelegatePath.h);
	}else{
		workflow.tipChooseRecored();
	}
}
/**
 * 描述：初始化查看页面信息
 */
function loadInfoForViewPage(pkfield) {
	workflow.getDelegate(pkfield,function(result){
		if(result.status==-1){
			top.showAlert(getLanguageValue("tip"), data.msg, 'error');
		} else {
			loadData(result.data);
		}
	});
	function loadData(jsondata){
		$("#delegateUserName").html(jsondata.delegateUserName);
		$("#status").html(delegateStatusFormatter(jsondata.status));
		$("#startTime").html(jsondata.startTime);
		$("#endTime").html(jsondata.endTime);
		$("#remark").text(jsondata.remark);
	}
}



/**
 * 弹出新增委托信息页面窗口
 */
var addDelegatePath = delegatePageRootPath.add;
function showAddPage(){
	top.getDlg(addDelegatePath.url,
			addDelegatePath.id,getLanguageValue(addDelegatePath.key),
			addDelegatePath.w,addDelegatePath.h);
}

/**
 * 保存新增的委托信息
 */
function saveDelegate(){
	var delegateuser = $("#hiddenDiv").val();
	if(!(typeof(delegateuser) != "undefined" && delegateuser.length>0)){
		tipAddDelegateUser();
		return;
	}
	
	var validateForm = $("#delegateForm");
	var saveBtnId = "saveDelegateBtn";
	disableButtion(saveBtnId);
	var validateResault = validateForm.form("validate");
	if(validateResault == false){
		enableButtion(saveBtnId);
		return validateResault;
	}
	var params = validateForm.serializeToJson();
	params.toUsers = delegateuser.split(",");
	beforeSaveDelegate(params);
	params.delegateType="1"; //角色委托
	workflow.addDelegate(params,function(result){
		if(result.status==1){
			top.showAlert(getLanguageValue("tip"), getLanguageValue("workflow.addDelegateSuccess"), 'info', function() {
				reloadData('delegate.htm',datagridID);
				closePanel('addDelegateIframe');
			});
		} else {
			top.showAlert(getLanguageValue("tip"), result.msg, 'error');
			enableButtion(saveBtnId);
		}
	})
}
/**
 * 提示添加委托用户
 * @returns
 */
function tipAddDelegateUser(){
	top.showAlert(getLanguageValue("tip"),getLanguageValue('workflow.addDelegateUser'),'info');
}
/**
 * 保存委托信息前置处理
 * @param params
 * @returns
 */
function beforeSaveDelegate(delegate){
	//处理时间格式：将时间转换为毫秒数
	delegate.startTime = datetimeToMillsConverter(delegate.startTime);
	delegate.endTime = datetimeToMillsConverter(delegate.endTime);
}
/**
 * 弹出修改委托信息页面窗口
 */
var updateDelegatePath = delegatePageRootPath.update;
function showUpdatePage(){
	var rows = datagridObj.datagrid('getSelections');
	if (rows.length == 1){
		top.getDlg(updateDelegatePath.url+"?pkfield="+rows[0].oid,
				updateDelegatePath.id,getLanguageValue(updateDelegatePath.key),
				updateDelegatePath.w,updateDelegatePath.h);
	}else{
		workflow.tipChooseRecored();
	}
}
/**
 * 初始化修改页面委托信息
 */
function loadInfoForUpdatePage(pkfield) {
	workflow.getDelegate(pkfield,function(result){
		if(result.status==-1){
			top.showAlert(getLanguageValue("tip"), result.msg, 'error');
		} else {
			loadData(result.data);
		}
	});
	function loadData(jsondata){
		$('#delegateForm').form('load',jsondata);
        $("#hiddenDiv").val("");
        personchoose.text=document.getElementById("textDiv");
        personchoose.hidden = document.getElementById("hiddenDiv");
        var text = new Array();
        text=jsondata.delegateUserName.split(",");
        var hidden = new Array();
        hidden=jsondata.delegateUser.split(",");
        personchoose.setUser(text,hidden);
	}
}
/**
 * 更新委托信息
 */
function updateDelegate(){
	var delegateuser = $("#hiddenDiv").val();
	if(!(typeof(delegateuser) != "undefined" && delegateuser.length>0)){
		tipAddDelegateUser();
		return;
	}
	
	var validateForm = $("#delegateForm");
	var saveBtnId = "updateDelegateBtn";
	disableButtion(saveBtnId);
	var validateResault = validateForm.form("validate");
	if(validateResault == false){
		enableButtion(saveBtnId);
		return validateResault;
	}
	var params = validateForm.serializeToJson();
	beforeSaveDelegate(params);
	params.toUsers = delegateuser.split(",");
	workflow.updateDelegate(params,function(result){
		if(result.status==1){
			top.showAlert(getLanguageValue("tip"), getLanguageValue("workflow.updateDelegateSuccess"), 'info', function() {
				//关闭弹出框
				reloadData('delegate.htm',datagridID);
			    closePanel("updateDelegateIframe");
			});
		} else {
			top.showAlert(getLanguageValue("tip"), result.msg, 'error');
			enableButtion(saveBtnId);
		}
	});
}

/**
 * 取消委托信息
 */
function cancelDelegate(){
	var rows = datagridObj.datagrid('getSelections');
	if (rows.length != 1){
		workflow.tipChooseRecored();
		return;
	}
	$.messager.confirm(getLanguageValue("workflow.cancelDelegate"), getLanguageValue("workflow.cancelDelegateConfirm"),
			function(confirmResult){
		if (confirmResult){
			workflow.cancelDelegate(rows[0].oid,function(result){
				if (result.status==-1){
					top.showAlert(getLanguageValue("tip"), result.msg, 'error');
				}else{
					top.showAlert(getLanguageValue("success"),getLanguageValue("workflow.cancelDelegateSuccess"),'ok',function(){
						refresh();
					});
				}  
			});
		}
	});
}