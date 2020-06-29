var pkfield="";
var userFormID = "userForm";
/**
 * 初始化
 */
$(document).ready(function(){
	var comboxid='';
	var singleDomainName='';	// 单选值域
	var morecomboxid='';
	var moreDomainName='';	// 多选值域
	comboxid+='userPost'+',';
	singleDomainName+='userpost'+","
	loadSelectData(comboxid,singleDomainName);
	loadMoreSelectData(morecomboxid,moreDomainName);
	
	pkfield=getParamter("id");
	getUserById();
});

/**
 * 根据用户id获取用户信息
 * @returns
 */
function getUserById(){
	$.ajax({
		url: rootPath+"jasframework/privilege/syncDeptUser/getUserById.do",//调用新增接口
		data :{"oid" : pkfield},
		type : 'GET',
		dataType:"json",
		success : function(data) {
			if(data.data.isPis == 1){
				$(".pisHidden").hide();
			}
//			$("#"+userFormID).form('load', data.data);
			$("#unitId").combotree({
				url: rootPath+'jasframework/privilege/unit/getLeftTree.do'
			});
			$('#unitId').combotree('setValue', data.data.unitId);
			loadData(data.data);
		},
		error : function(result) {
			top.showAlert(getLanguageValue("error"), getLanguageValue("queryError"), 'info');
		}
	});
}

/**
 * desc 加载数据初始数据
 */
function loadData(data){
	$('#oid').val(data.oid);
	$("#loginName").val(data.loginName);
	$("#userName").val(data.userName);
	$("#phone").val(data.phone);
	$("#email").val(data.email);
	$("#passwordExpiredDate").val(data.passwordExpiredDate);
	$("#description").val(data.description);
	$('#userPost').combobox('setValue', data.userPost);
}

/**
 * desc 关闭修改页面
 */
function closePanel() {
	top. closeDlg("editUserIframe");
}

/**
 * desc 重新加载数据
 * @param url 重新加载数据的页面
 * @param elementId datagridID
 */
function reloadData(url, elementId) {
	var fra = parent.$("iframe");
	for ( var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}

/**
 * desc 修改用户
 */
function updateUser() {
	disableButtion("saveButton");
	var validateResault=$("#"+userFormID).form('validate');
	if(validateResault == false){
		top.showAlert(getLanguageValue("tip"), getLanguageValue("formVailidateFailed"), 'info');
		enableButtion("savebutton");
		return validateResault;
	}else{
		$.ajax({
			url: rootPath+"jdbc/commonData/user/update.do",//调用新增接口
		    method: "post",
		    contentType: "application/json;charset=utf-8",
		    dataType: "json",
		    data:JSON.stringify($("#"+userFormID).serializeToJson()),//获取表单中的json,
		    success: function(data){
				if(data.status==1){
					top.showAlert(getLanguageValue("tip"), getLanguageValue("updatesuccess"), 'info', function() {
						//关闭弹出框
						reloadData('queryUser.htm','#10060201');
					    closePanel();
					});
				} else {
					top.showAlert(getLanguageValue("error"),getLanguageValue("user.userexist"), 'error');
					enableButtion("saveButton");
				}
		    }
		 });
	}
}

/**
 * @desc 关闭修改页面
 */
function closeUser(){
	top. closeDlg("editUserIframe");
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
//			setComboObjWidth(id,0.29,'combobox');
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
		