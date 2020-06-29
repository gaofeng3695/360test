var privilegeId = "";
/**
 * 描述：重新加载数据
 * 
 * @param shortUrl
 *            重新加载数据的页面
 * @param elementId
 *            权限书的id
 */
function loadData() {
	url = rootPath + "jasframework/privilege/menu/getById.do?oid="
			+ getParamter("oid");
	jQuery.post(url, function(data) {
		$('#updateMenu').form('load', data);
		privilegeId = data.privilegeId;
	}, "json");
}

/** *保存完成后刷新父页面的菜单树** */
function reloadtree(shortUrl, parentId) {
	var fra = parent.$("iframe");
	for (var i = 0; i < fra.length; i++) {
		if (fra[i].src.indexOf(shortUrl) != -1) {
			fra[i].contentWindow.reloadchildren(parentId);
		}
	}
}
var width;
// 页面初始化
$(document).ready(function() {
	loadData();
	getappsystem();
	width = $("#privilegeId").width();
	$("#privilegetype").combobox({
		"onChange" : function() {
			onchangmenu();
		}
	});
	initcombotree();
});

function initcombotree() {
	// $("#parentId").combotree({
	// url:
	// rootPath+"jasframework/privilege/menu/getListByAppId.do?appId="+getParamter("appId"),
	// });
	// setComboObjWidth('parentId',0.3,'combotree');
	/** 定义权限下拉树combotree** */
	$("#privilegeId").combotree({
		panelHeight : 200,
		panelWidth : width
	});
	setComboObjWidth('privilegeId', 0.3, 'combotree');
}

/**
 * 描述：获得应用系统
 */
function getappsystem() {
	$.ajax({
		url : rootPath
				+ "jasframework/privilege/application/getList.do",
		type : "post",
		success : function(result) {
			// $('#appId').combobox({
			// data:result,
			// valueField:'oid',
			// textField:'appName'
			// });
			$('#appId1').combobox(
				{
					data : result,
					valueField : 'oid',
					textField : 'appName',
					onChange : function() {
						$("#privilegeId").combotree(
							{
								url : rootPath+ "jasframework/privilege/privilege/getAllPrivilegeZTreebyappId.do?appId="+ $('#appId1').combobox("getValue"),
								onLoadSuccess : function(node,data) {
									var node = $("#privilegeId").combotree("tree").tree('find',privilegeId);
									if (node == null) {
										$("#privilegeId").combotree('clear');
									} else {
										$('#privilegeId').combotree('setValue',privilegeId);
									}
								},
								onShowPanel : function() {
									// var
									// node=$("#privilegeId").combotree("tree").tree('find',privilegeId);
									// if(node!=null){
									// expandNode(node);
									// $("#privilegeId").combotree('tree').tree("scrollTo",node.target);
									// }
								}
							});
						setComboObjWidth('privilegeId',
								0.3, 'combotree');
					}
				});
			// $('#appId').combobox("setValue",getParamter("appId"));
			$('#appId1').combobox("setValue", getParamter("appId"));
			$('#appId').val(getParamter("appId"))
			setComboObjWidth('privilegeType', 0.3, 'combobox');
			// setComboObjWidth('appId',0.3,'combobox');
			setComboObjWidth('appId1', 0.3, 'combobox');
			setComboObjWidth('childrenPrivilege', 0.8, 'combobox');
			// $('#appId').combobox("disable");
		},
		dataType : "json",
		error : function() {
		}
	});
}
/**
 * 描述：更新菜单
 */
function updateMenu() {
	disableButtion("saveButton");
	var appId = getParamter("appId");
	var privilegeCode = $("#privilegeCode").val();
	var oid = getParamter("oid");
	var data = {
		"oid" : oid,
		"appId" : appId,
		"menuName" : $("#menuName").val()
	};
	var checkurl = rootPath + "jasframework/privilege/menu/checkMenuName.do";
	var flag = false;
	// 校验编号是否合法
	$.ajax({
		type : "POST",
		url : checkurl,
		data : data,
		success : function(check) {
			if (check.status == -1) {
				top.showAlert(getLanguageValue("error"), check.msg, 'error');
				enableButtion("saveButton");
			} else {
				flag = true;
			}
		},
		dataType : "json",
		async : false
	});
	if (flag) {
		var validateResault = $('#updatePrivilege').form("validate");
		var formData = $("#updateMenu").serializeToJson();// 获取表单中的json,
		formData.appId = getParamter("appId");
		formData.parentId = getParamter("parentId");
		var formStringData = JSON.stringify(formData);
		var url = rootPath + 'jasframework/privilege/menu/update.do';
		$.ajax({
			url : url,// 调用新增接口
			method : "post",
			contentType : "application/json;charset=utf-8",
			dataType : "json",
			data : formStringData,
			success : function(result) {
				if (result.status == 1) {
					top.showAlert(getLanguageValue("tip"), getLanguageValue("savesuccess"), 'info', function() {
						reloadtree("querymenu.htm", getParamter("parentId"));
						closePrivilege();
					});

				} else {
					top.showAlert(getLanguageValue("tip"), result.msg, 'info');
					enableButtion("saveButton");
				}
			}
		});
	}
	// $('#updateMenu').form('submit',{
	// url:
	// rootPath+"jasframework/privilege/menu/updateMenu.do?appnumber="+getParamter("appnumber"),
	// onSubmit: function(){
	// var bool=$(this).form('validate');
	// if(bool==false){
	// enableButtion("savebutton");
	// }
	// var eventid=getParamter("menuid");
	// var parenteventid=$("#parenteventid").combotree("getValue");
	// if(eventid==parenteventid){
	// alert("父菜单不能为自己");
	// return false;
	// }else{
	// var bool=parsetree(eventid,parenteventid);
	// if(!bool){
	// alert("父菜单不能为自己的子菜单");
	// return false;
	// }
	// }
	//			
	// return bool;
	// },
	// success: function(result){
	// result=jQuery.parseJSON(result);
	// if(result.success==1){
	// reloadtree("querymenu.htm",getParamter("parentid"));
	// closePrivilege();
	// }else{
	// alert('新增失败');
	// }
	// }
	// });
}

function parsetree(parentid, treeitemid) {
	var parenttree = $("#parenteventid").combotree("tree");
	var itema = parenttree.tree("find", treeitemid);
	var parentitem = parenttree.tree("getParent", itema.target);
	if (parentitem != null) {
		if (parentitem.id != parentid) {
			return parsetree(parentid, parentitem.id);
		}
	} else {
		return true;
	}
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
/**
 * 展开所要查找的节点的父节点，用于tree节点的定位
 * 
 * @param node
 *            所有定位的节点
 */
function expandNode(node) {
	var parentNode = $("#privilegeid").combotree('tree').tree('getParent',
			node.target);
	if (parentNode != null) {
		$("#privilegeid").combotree('tree').tree('expand', parentNode.target);
		expandNode(parentNode);
	}
}
