/**
 * 描述：重新加载数据
 * 
 * @param shortUrl
 *            重新加载数据的页面
 * @param elementId
 *            权限书的id
 */
function reloadData(shortUrl, elementId) {
	var fra = parent.$("iframe");
	for (var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {

			fra[i].contentWindow.selectappsystem();
		}
	}
}

function reloadtree(shortUrl, parentId) {
	var fra = parent.$("iframe");
	for (var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.reloadchildren(parentId);
		}
	}
}
var parentId = getParamter("parentId");
var appId = getParamter("appId");
// 页面初始化
$(document).ready(function() {
	getappsystem();
	$("#privilegetype").combobox({
		"onChange" : function() {
			onchangmenu();
		}
	});
	initcombotree();

});

function initcombotree() {
	$("#parentId").combotree({
		url : rootPath+ "jasframework/privilege/menu/getListByAppId.do?appId=" + getParamter("appId"),
		onLoadSuccess : function(data) {
			$("#parentId").combotree("setValue",data[0].parentId);
		}
	});
	setComboObjWidth('parentId', 0.3, 'combotree');
}

/**
 * 描述：获得应用系统
 */
function getappsystem() {
	$.ajax({
		url : rootPath + "jasframework/privilege/application/getList.do",
		type : "post",
		success : function(result) {
			$('#appId').combobox({
				data : result,
				valueField : 'oid',
				textField : 'appName'
			});
			$('#appId').combobox("setValue", getParamter("appId"));

			$('#appId1').combobox({
				data : result,
				valueField : 'oid',
				textField : 'appName',
				onSelect : function(data) {
					var systemurl = data.url;
					$("#privilegeId").combotree({
						url : rootPath
								+ "jasframework/privilege/privilege/getAllPrivilegeZTreebyappId.do?appId="
								+ data.oid,
						onClick : function(
								node) {
							// alert(JSON.stringify(node));
							// $('#orderNum').val(node.attributes.privilegeCode);
							$('#privilegeCode').val(node.attributes.privilegeCode);
							// var
							// url=node.attributes.url.split("../");
							// url=url[url.length-1];
							// if(url!="null"
							// &&
							// url!=""){
							// if(systemurl==undefined
							// ||systemurl==""){
							// $('#url').val(rootPath+url);
							// }else{
							// $('#url').val(systemurl+url);
							// }
							// }
							$('#url').val(node.attributes.url);
						}
					});
				setComboObjWidth('privilegeId',
						0.3, 'combotree');
				},
				onLoadSuccess : function(data) {
					$(this).combobox("select",
							data[0].oid);
				}
			});
			$('#appsystemId').val(getParamter("appId"));
			setComboObjWidth('privilegeType', 0.3, 'combobox');
			setComboObjWidth('appId', 0.3, 'combobox');
			setComboObjWidth('appId1', 0.3, 'combobox');
			setComboObjWidth('childrenPrivilege', 0.8, 'combobox');
			$('#appId').combobox("disable");
		},
		dataType : "json",
				error : function() {
			}
		});
}
/**
 * 描述：保存权限
 */
function savemenu() {
	disableButtion("saveButton");
	var appId = $("#appId").combobox("getValue");
	var flag = false;
	// 校验编号是否合法
	$.ajax({
		type : "POST",
		url : rootPath + "jasframework/privilege/menu/checkMenuName.do?",
		data : {
			appId : getParamter("appId"),
			menuName : $("#menuName").val()
		},
		success : function(check) {
			if (check.status == -1) {
				top.showAlert(getLanguageValue("tip"), check.msg, 'error');
				enableButtion("saveButton");
			} else {
				flag = true;
			}
		},
		dataType : "json",
		async : false
	});
	if (flag) {
		var validateResault = $("#addMenu").form("validate");
		if(validateResault == false){
			top.showAlert(getLanguageValue("tip"), getLanguageValue("formVailidateFailed"), 'info');
			enableButtion("saveButton");
			return validateResault;
		}
		var formData = $("#addMenu").serializeToJson();// 获取表单中的json,
		formData.parentId = parentId;
		formData.appId = appId;
		var formStringData = JSON.stringify(formData);
		var url = rootPath + 'jasframework/privilege/menu/save.do';
		$.ajax({
			url : url,// 调用新增接口
			method : "post",
			contentType : "application/json;charset=utf-8",
			dataType : "json",
			data : formStringData,
			success : function(result) {
				if (result.status == 1) {
					top.showAlert(getLanguageValue("tip"), getLanguageValue("savesuccess"), 'info', function() {
						reloadtree("querymenu.htm", parentId);
						closePrivilege();
					});
				} else {
					top.showAlert(getLanguageValue("tip"), result.msg, 'info');
					enableButtion("saveButton");
				}
			}
		});
	}

	// var
	// checkurl=rootPath+"jasframework/privilege/menu/checkmenuname.do?appnumber="+getParamter("appnumber")+"&menuname="+$("#name").val();
	// $.getJSON(checkurl,function(check){
	// if(check.success=="1"){
	// $('#addmenu').form('submit',{
	// url:
	// rootPath+"/jasframework/privilege/menu/savemenu.do?appnumber="+getParamter("appnumber"),
	// onSubmit: function(){
	// var bool=$(this).form('validate');
	// if(bool==false){
	// enableButtion("saveButton");
	// }
	// return bool;
	// },
	// success: function(result){
	// result=jQuery.parseJSON(result);
	// if(result.success==1){
	// reloadtree("querymenu.htm",parentid);
	// closePrivilege();
	// }else{
	// alert('新增失败');
	// }
	// }
	// });
	// }else{
	// top.showAlert(getLanguageValue("tip"), check.msg, 'error');
	// }
	// });
}

/**
 * 描述：关闭添加页面
 */
function closePrivilege() {
	top.closeDlg("saveiframe");
}

/**
 * 描述：扩展校验方法的规则
 */
$.extend($.fn.validatebox.defaults.rules, {
	verifyName : {// 判断分段逻辑号 是否重复
		validator : function(value) {
			var response = $.ajax({
				url : "../groupmanagement.do?method=verifyName",
				dataType : "json",
				data : {
					groupname : value
				},
				async : false,
				cache : false,
				type : 'POST'
			}).responseText;
			var b = $.parseJSON(response);
			if (b.space == 9) {
				this.message = getLanguageValue("menu.nameCannotInertSpace");
				return false;
			}
			if (b.success == 5) {
				return true;
			} else {
				this.message = getLanguageValue("menu.nameIsUsed");
				return false;
			}
			// return b.success;
		},
		message : null
	}
});

function onchangmenu() {
	var changtype = $("#privilegetype").combobox("getValue");
	if (changtype == 1 || "1" == changtype) {
		$("#childrenPrivilege").combobox("enable");
		$("#childrenPrivilege").parent().parent().show();
	} else {
		$("#childrenPrivilege").combobox("disable");
		$("#childrenPrivilege").parent().parent().hide();
	}
}
