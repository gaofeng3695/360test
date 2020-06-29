/** 
 * @file
 * @author  xxx
 * @version 1.0 
 * @desc  查看用户信息页面js
 * @date  2012-08-30 上午17:46:07 
 * @last modified by lizz
 * @last modified time  2017-08-17
 */

var pkfield="";

/**
 * @desc 初始化
 */
$(document).ready(function(){
	pkfield=getParamter("id");
	getUserById();
	//加载数据变更记录
	addBusinessHistoryRecords(pkfield,"histroryRecordContainer");
});

/**
 * @desc 获取用户信息
 */
function getUserById(){
	$.ajax({
//		url: rootPath+"jdbc/commonData/user/get.do",//调用新增接口
		url: rootPath+"jasframework/privilege/syncDeptUser/getUserById.do",
		data :{"oid" : pkfield},
		method : 'GET',
		dataType:"json",
		success : function(data) {
			loadData(data.data);
		},
		error : function(result) {
			top.showAlert(getLanguageValue("error"), getLanguageValue("queryError"), 'info');
		}
	});
}

/**
 * @desc 载入数据
 */
function loadData(data) {	
	$("#loginName").html(data.loginName);
	$("#userName").html(data.userName);
	$("#pass").html(data.pass);	
	$("#phone").html(data.phone);
	$("#email").html(data.email);
	$("#passwordExpiredDate").html(data.passwordExpiredDate);
	$("#description").html(data.description);
	$("#cnpcADUser").html(data.cnpcADUser);
	$("#ptrADUser").html(data.ptrADUser);
	if(data.isPis == 1){
		$("#isPis").html("是");
	}else{
		$("#isPis").html("否");
	}
	$("#syncDate").html(data.syncDate);
	$("#userPost").html(data.userPostName);
}

/**
 * @desc 关闭窗口
 */
function closeUser(){
	top. closeDlg("viewUserIframe");
}