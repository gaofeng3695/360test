/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
var coid='';

var businessId = "";	// 用于附件判断业务ID

//当前登陆用户
var user = JSON.parse(sessionStorage.user);

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	getGpsChangeInfo();
	
	// 加载图片信息
	getPicListInfo(coid, "view");  // 不带描述信息  图片
	getFileListInfo(coid, "view"); // 附件信息
	masterTableChildHeight();	// 计算标签内容高度
//	masterTableChildHeight1('contentArea');	// 计算标签内容高度
	masterTableChildHeight1('changeinfo');
});

function getGpsChangeInfo(){
	$.ajax({
		url : rootPath+"/gpsconstructionlevelchange/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				coid = data.data.coid;
				getGpsConstructionById(coid);
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}

/**
 * @desc 获得数据
 */
function getGpsConstructionById(coid){
	$.ajax({
		url : rootPath+"/gpsconstruction/getInfo.do",
		data :{"oid" : coid,},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
				getChangeData(coid);
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}

function getChangeData(coid){
	$.ajax({
		url : rootPath+"/gpsconstructionlevelchange/getChangeInfo.do",
		data :{"oid" : coid},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadChangeData(data.data);
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}

/**
 * 加载等级变更历史数据
 * @param jsondata
 * @returns
 */
function loadChangeData(jsondata){
	var rs = '';
	if(jsondata==null || jsondata.length == 0){
		return;
	}
	var j = jsondata.length;
	for(var i=0; i<jsondata.length; i++){
		if((jsondata[i].oid) === (pkfield)){
			rs += '<div class="table-content"><h6 class="table-title">第'+j+'次风险等级变更</h6>'
				+ '<table align="center" class="detail-table">'
				+ '<tr><th width="15%"><span>距离管线长度(m)</span></th>'
				+ '<td width="35%"><span>'+jsondata[i].changedistanceline+'</span></td><th width="15%"><span>风险等级</span></th>'
				+ '<td width="35%"><span>'+jsondata[i].changeriskratingCodeName+'</span></td></tr>'
				+ '<tr><th width="15%"><span>变更发起人</span></th><td width="85%" colspan="3"><span>'+jsondata[i].changeuseridname+'</span></td></tr>'
				if(jsondata[i].changereasondescr == null ) {
					rs += '<tr><th width="15%"><span>变更理由（100字以内）</span></th><td width="85%" colspan="3" style="height:50px"><span></span></td></tr>';
					rs += '</table></div>';
				} else {
					rs += '<tr><th width="15%"><span>变更理由（100字以内）</span></th><td width="85%" colspan="3" style="height:50px"><span>'+jsondata[i].changereasondescr+'</span></td></tr>';
					rs += '</table></div>';
				}
			}
		j--;
	}
	$('#changeinfo').append(rs);
	
}


function changedistancelinechange(){
	if($.trim($('#changedistanceline').val()) == ""){
		$('#changeriskrating').combobox('setValue', null);
		return;
	}
	var value = Number($('#changedistanceline').val());
	if(isNaN(value)){
		$('#changeriskrating').combobox('setValue', null);
		return;
	}
	
	if(value <= 5){
		$('#changeriskrating').combobox('setValue', '01');
	}else if(value > 5 && value <=50){
		$('#changeriskrating').combobox('setValue', '02');
	}else if(value > 50){
		$('#changeriskrating').combobox('setValue', '03');
	}
}


/**
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$('#coid').val(jsondata.oid);
	$("#unitidname").html(jsondata.unitidname);
	$("#lineloopoidname").html(jsondata.lineloopoidname);
	$("#location").html(jsondata.location);
	$("#stakenumname").html(jsondata.stakenumname);
	$("#lon").html(jsondata.lon);
	$("#lat").html(jsondata.lat);
	$("#happenbegindate").html(jsondata.happenbegindate);
	$("#constructunit").html(jsondata.constructunit);
	$("#constructunituser").html(jsondata.constructunituser);
	$("#constructdescr").html(jsondata.constructdescr);
	$("#distanceline").html(jsondata.distanceline);
	$("#riskratingCodeName").html(jsondata.riskratingCodeName);
	$("#progressidCodeName").html(jsondata.progressidCodeName);
	$("#riskdescr").html(jsondata.riskdescr);
	$("#stationuser").html(jsondata.stationuser);
	$("#inspectoroidname").html(jsondata.inspectoroidname);
	$("#inspectorphone").html(jsondata.inspectorphone);
	$("#descr").html(jsondata.descr);
	$('#temporarykeypointoidname').html(jsondata.temporarykeypointoidname);
	$('#projectname').html(jsondata.projectname);
	$('#constructreason').html(jsondata.constructreasonname);

	$('#ownerUnitName').html(jsondata.ownerUnitName);
	$('#ownerContacts').html(jsondata.ownerContacts);
	$('#ownerContactsPhone').html(jsondata.ownerContactsPhone);
	$('#measures').html(jsondata.measures);
	$('#estimateEndDate').html(jsondata.estimateEndDate);
	$('#companyContacts').html(jsondata.companyContacts);
	$('#companyContactsPhone').html(jsondata.companyContactsPhone);
	$('#stationLeading').html(jsondata.stationLeading);
	$('#stationLeadingPhone').html(jsondata.stationLeadingPhone);
}

/**
 * @desc 重新加载数据
 * @param shortUrl 重新加载数据的页面
 * @param elementId 权限列表的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}
/**
 * @desc 关闭修改页面
 */
function closePanel() {
	top. closeDlg("viewChangeGpsConstruction");
}

/**
 * @desc 保存并提交
 */
function saveAndSubmit(){
	disableButtion("saveAndSubmit");
	var bool=$('#gpsConstructionForm').form('validate');
	if(bool==false){
		enableButtion("saveAndSubmit");
		return bool;	
	}
	$("#saveButton").trigger('click');
	if(!isNull(bussinessId)){
		submit();
	}
}
/**
 * @desc 工作流-提交
 */
function submit() {
	//设置工作流参数
	var paraArr=new Map();
	var comment = "";
	var workflowName="workflow_gpsconstruction";
	var subject="";
	var businessEventId=pkfield;
	//开启工作流
	startWorkflow(businessEventId, workflowName,subject,comment,true,callbackFun,paraArr);
}

/**
 * @desc 回调函数：设置该条记录的状态为2【审核中】
 * @param result
 */
function callbackFun(result){
	if (result.success){
		$.messager.alert('正确',result.successMessage,'ok',function(){
			$.ajax({
				url:rootPath+"/gpsconstruction/submitGpsConstruction.do",
				data: {"oid" : pkfield},
				async:false,
				dataType:"json",
				success:function(data){
					closePanel();
				},
				error:function(result){
					alert('提示',"提交出错",'error');
				}
			});
		});
	} else {
		$.messager.alert('提示',"已提交审核，不能重复提交",'info');
	}
}

/**
 * @desc 获取主子表tab切换的内容元素高度
 */
function masterTableChildHeight1(contentArea){
	if (document.getElementById('tabContainer') != null) {
		/*$("#tabContainer").tabs("resize",{
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		});*/
	
		var tabsPanelsHeight = $(".master-table .easyui-tabs").height()-$(".master-table .tabs-header").outerHeight(),
			tabsPanelsPaddingTop = parseInt($(".tabs-panels").css("padding-top")),
			tabsPanelsPaddingBottom = parseInt($(".tabs-panels").css("padding-bottom"));
		$(".tabs-panels").height(tabsPanelsHeight-tabsPanelsPaddingTop-tabsPanelsPaddingBottom);
		$("#"+contentArea).height($(".tabs-panels").height()-70);
		$(".tabs-panels .panel-body").height($(".tabs-panels").height());
	}
}

/**
 * @desc 获取主子表tab切换的内容元素高度
 */
function masterTableChildHeight(){
	
	if (document.getElementById('tabContainer') != null) {
		$("#tabContainer").tabs("resize",{
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		});
	
		var tabsPanelsHeight = $(".master-table .easyui-tabs").height()-$(".master-table .tabs-header").outerHeight(),
			tabsPanelsPaddingTop = parseInt($(".tabs-panels").css("padding-top")),
			tabsPanelsPaddingBottom = parseInt($(".tabs-panels").css("padding-bottom"));
		$(".tabs-panels").height(tabsPanelsHeight-tabsPanelsPaddingTop-tabsPanelsPaddingBottom);
		$("#contentArea").height($(".tabs-panels").height()-20);
		$(".tabs-panels .panel-body").height($(".tabs-panels").height());
	}
}

