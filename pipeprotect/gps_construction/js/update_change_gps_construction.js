/**
 * @file
 * @author 作者
 * @desc 修改页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID

var businessId = "";	// 用于附件判断业务ID

//当前登陆用户
var user = JSON.parse(sessionStorage.user);

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	getGpsConstructionById();
	
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='changeriskrating'+',';
	singleDomainName+='construnctionRiskLevel'+","
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	initChangeUser();
	
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
	masterTableChildHeight()	// 计算标签内容高度
	masterTableChildHeight1('changeinfo')	// 计算标签内容高度
});

/**
 * @desc 获得数据
 */
function getGpsConstructionById(){
	$.ajax({
		url : rootPath+"/gpsconstruction/getInfo.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
				getChangeData();
			}else{
				top.showAlert('错误', '查询出错', 'info');
			}
		},
		error : function(result) {
			top.showAlert('错误', '查询出错', 'info');
		}
	});
}

function getChangeData(){
	$.ajax({
		url : rootPath+"/gpsconstructionlevelchange/getChangeInfo.do",
		data :{"oid" : pkfield},
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
	var j = jsondata.length-1;
	var row = jsondata[0];
	$('#updatechangetitle').html('第'+jsondata.length+'次风险等级变更');
	$('#changedistanceline').val(row.changedistanceline);
	$('#changeriskrating').combobox('setValue', row.changeriskrating);
//	$('#changeuseridname').val(row.changeuseridname);
//	$('#changeuserid').val(row.changeuserid);
//	$('#changeuserunitid').val(row.changeuserunitid);
	$('#changeuseridname').val(user.userName);
	$('#changeuserid').val(user.oid);
	$('#changeuserunitid').val(user.unitId);
	
	$('#changereasondescr').val(row.changereasondescr);
	$('#oid').val(row.oid);
	
	for(var i=1; i<jsondata.length; i++){
		rs += '<div class="table-content"><h6 class="table-title">第'+j+'次风险等级变更</h6>'
			+ '<table align="center" class="detail-table">'
			+ '<tr><th width="15%"><span>距离管线长度(m)</span></th>'
			+ '<td width="35%"><span>'+jsondata[i].changedistanceline+'</span></td><th width="15%"><span>风险等级</span></th>'
			+ '<td width="35%"><span>'+jsondata[i].changeriskratingCodeName+'</span></td></tr>'
			+ '<tr><th width="15%"><span>变更发起人</span></th><td width="85%" colspan="3" ><span>'+jsondata[i].changeuseridname+'</span></td></tr>'
			
			if(jsondata[i].changereasondescr == null ) {
				rs += '<tr><th width="15%"><span>变更理由（100字以内）</span></th><td width="85%" colspan="3" style="height:50px"><span></span></td></tr>';
				rs += '</table></div>';
			} else {
				rs += '<tr><th width="15%"><span>变更理由（100字以内）</span></th><td width="85%" colspan="3" style="height:50px"><span>'+jsondata[i].changereasondescr+'</span></td></tr>';
				rs += '</table></div>';
			}
		j--;
	}
	$('#changeinfo').append(rs);
}

function initChangeUser(){
	$('#changeuserid').val(user.oid);
	$('#changeuseridname').val(user.userName);
	$('#changeuserunitid').val(user.unitId);
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
 * @desc 上传图片执行成功之后上传附件
 */
function updatePicSuccessFun(){
	updateFileFun(updateSuccessFun);
}

/**
 * @desc 上传附件执行成功之后上传图片
 */
function  updateFileSuccessFun(){
	updatePicFun(updateSuccessFun);
}

/**
 * @desc 修改成功之后执行的函数
 */
function updateSuccessFun(){
	top.showAlert("提示", "更新成功", 'info', function() {
		//关闭弹出框
		reloadData("query_change_gps_construction.html","#gpsConstructiondatagrid");
	    closePanel();
	});
}

/**
 * @desc 修改数据-保存
 */
function updateGpslevelchangeConstruction(){
	disableButtion("saveButton");
	var bool=$('#gpsConstructionForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpsconstructionlevelchange/updateChangeInfo.do",
		type: "post",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsConstructionForm').serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
//	    		updateFileFun(updateFileSuccessFun);  // 先上传附件 后上传图片
	    		top.showAlert("提示", "保存成功", 'info', function() {
					//关闭弹出框
					reloadData("query_change_gps_construction.html","#gpsConstructiondatagrid");
				    closePanel();
				});
			}else if(data.code == "400") {
				top.showAlert("提示", "更新失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
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
	$("#constructreason").html(jsondata.constructreasonname);
	$("#projectname").html(jsondata.projectname);
	$('#temporarykeypointoidname').html(jsondata.temporarykeypointoidname);
}

/**
 * @desc 加载新增，修改单选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param singleDomainName 值域名称，以逗号隔开
 */
function loadSelectData(comboxid,singleDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select = comboxid.split(",");
		var singleDomainNameArr = singleDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			if(singleDomainNameArr[i]==''){
				continue;
			}
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+singleDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
//						$('#'+id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.270,'combobox');
		}
	}
}

/**
 * @desc 加载新增，修改多选选下拉列表框
 * @param comboxid 下拉列表框的id，以逗号隔开
 * @param moreDomainName 值域名称，以逗号隔开
 */
function loadMoreSelectData(comboxid,moreDomainName){
	if(comboxid!='' && comboxid !=undefined){
		var select = comboxid.split(",");
		var moreDomainNameArr = moreDomainName.split(",");
		for(var i=0;i<select.length-1;i++){
			if(moreDomainNameArr[i]==''){
				continue;
			}
			var id=select[i];
			$('#' + id).combobox({
				panelHeight:100,
				multiple:true,
				url : rootPath+"jasframework/sysdoman/getDoman.do?domainName="+moreDomainNameArr[i],
				valueField : 'codeId',
				textField : 'codeName',
				onSelect : function(row){
					//保存个性表单的值域value值
					$('#'+id).val(row.codeId);
					$('#'+id+'ID').val(row.codeName);
				},
				onLoadSuccess:function(data){
					if(data.length>0){
						$('#' + id).combobox('setValue',data[0].codeId);
					}
				}
			});
			setComboObjWidth(id,0.29,'combobox');
		}
	}
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
	top. closeDlg("updateChangeGpsConstruction");
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
		$(".tabs-panels").height(tabsPanelsHeight-tabsPanelsPaddingTop-tabsPanelsPaddingBottom-40);
		$("#"+contentArea).height($(".tabs-panels").height()-70);
		$(".tabs-panels .panel-body").height($(".tabs-panels").height());
	}
}

