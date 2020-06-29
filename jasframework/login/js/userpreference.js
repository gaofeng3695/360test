// getFileName();
/* 初始化布局，计算各个区域的高度和宽度 */

window.onload = function() {
	// 加载左侧菜单树
	createAllFunctionMenuTree();
	// 加载我配置的菜单
	createConfigFunctionMenuTree();
	// 获取用户的首页设置
	getUserViewConfig();
}
/**
 * 创建并加载左侧菜单树
 */
function createAllFunctionMenuTree() {
	$('#allFuntionMenuTree').tree({
		url : rootPath + '/jasframework/privilege/privilege/getAllUserFuntion.do',
		onBeforeExpand : function(node, param) {
			/*
			 * $('#allFuntionMenuTree').tree('options').url = "/common/GetGoupJsonByPid.ashx?pid=" + node.id;// change the url
			 */},
		onClick : function(node) {
		},
		onDblClick : function(node) {
			addToMyConfigFunction(node);
		},
		onContextMenu : function(e, node) {
			e.preventDefault();
			$('#allFuntionMenuTree').tree('select', node.target);
			var isLeaf = $('#allFuntionMenuTree').tree('isLeaf', node.target);
			if (isLeaf) {
				$('#menu').menu('show', {
					left : e.pageX,
					top : e.pageY
				});
			}
			return false;
		}
	});
}
/* 创建并加载用户配置的菜单组织结构树 */
function createConfigFunctionMenuTree() {
	$('#myConfigFunctionMenuTree').tree({
		url : rootPath + '/jasframework/login/SysUserconfig/getUserConfigFunction.do',
		onClick : function(node) {
			$(this).tree('toggle', this.target);
		},
		onContextMenu : function(e, node) {
			e.preventDefault();
			$('#myConfigFunctionMenuTree').tree('select', node.target);
			node.attributes && node.attributes.type == '1';
			var isLeaf = $('#myConfigFunctionMenuTree').tree('isLeaf', node.target);
			var isfnode = isFunctionNode(node);
			if (isfnode) {
				$('#menu2').menu('show', {
					left : e.pageX,
					top : e.pageY
				});
			} else {
				$('#menu3').menu('show', {
					left : e.pageX,
					top : e.pageY
				});
			}
			return false;
		},
		onBeforeEdit : function(node) {
		},
		onAfterEdit : function(node) {
			var rootNodesArray = $('#myConfigFunctionMenuTree').tree('getRoots');
			if (rootNodesArray) {
				for ( var i = 0; i < rootNodesArray.length; i++) {
					var id = rootNodesArray[i].id;
					if (id != node.id) {
						var text = rootNodesArray[i].text;
						if (text && text == node.text) {
							$.messager.alert(getLanguageValue("tip"), getLanguageValue("directorynameexist"), 'info', function() {
								$('#myConfigFunctionMenuTree').tree('beginEdit', node.target);
							});
							break;
						}
					}
				}
			}
		},
		onSelect : function(node) {
			document.getElementById('functionname').value = node.text;
			document.getElementById('functionid').value = node.id;
			var isfnode = isFunctionNode(node);
			if (isfnode) {
				document.getElementById('addButton').disabled = true;
				document.getElementById('updateButton').disabled = true;
				document.getElementById('defaltButton').disabled = false;
			} else {
				document.getElementById('addButton').disabled = false;
				document.getElementById('updateButton').disabled = false;
				document.getElementById('defaltButton').disabled = true;
			}
		}
	});
}
/* 判断是否是具体的功能菜单节点 */
function isFunctionNode(node) {
	if (node.attributes && node.attributes.type == '1') {
		return true;
	} else {
		return false;
	}
}

var hasconfig = 0;// 是否已进行过个性化设置
/* 获取用户配置的首页配置项 */

function getUserViewConfig() {
	$.ajax({
		type : "POST",
		url : rootPath + "/jasframework/login/SysUserconfig/getUserViewConfig.do",
		dataType : "json",
		success : function(data) {
			hasconfig = data.hasconfig;
			if (hasconfig == '0') {
			} else {
				document.getElementById('homefunctionname').value = data.homefunctionname;
				document.getElementById('homefunctionid').value = data.homefunctionid;
				if (data.show2d == '1') {
					document.getElementById('show2d').checked = true;
				}

				if (data.show3d == '1') {
					document.getElementById('show3d').checked = true;
				}

				$.each($("input[name='pagelayout']"), function() {
					if ($(this).val() == data.pagelayout) {
						$(this).attr("checked", "checked");
					}
				});
			}
		}
	});
}

/* 保存用户菜单组织结构设置 */
function saveUserFunctionConfig() {
	var jsonobject = {};
	var nodeArray = [];
	var nodes = $('#myConfigFunctionMenuTree').tree('getRoots');
	if (nodes == null || nodes.length == 0) {
	} else {
		for ( var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var nodedata = $('#myConfigFunctionMenuTree').tree('getData', node.target);
			var nodejson = {};
			nodejson.id = nodedata.id;
			nodejson.text = nodedata.text;

			if (nodedata.children) {
				var children = [];
				// alert(nodedata.children.length)
				for (j = 0; j < nodedata.children.length; j++) {
					var childNode = {};
					childNode.id = nodedata.children[j].id;
					childNode.text = nodedata.children[j].text;
					// alert(childNode.text)
					children.push(childNode);
				}
				nodejson.children = children;
			}
			nodeArray.push(nodejson);
		}
	}
	jsonobject.treeData = nodeArray;
	$.ajax({
		type : "POST",
		url : rootPath + "/jasframework/login/SysUserconfig/saveSysUserfunctionconfig.do?1=1",
		data : {
			"treeData" : JSON.stringify(jsonobject)
		},
		dataType : "json",
		success : function(result) {
			// var result = eval('('+result+')');
			if (result.success) {
				$.messager.alert('成功', '保存菜单设置成功', 'info');
			} else {
				$.messager.alert('错误', '保存菜单设置失败', 'error');
			}
		}
	});
}

/* 去掉easyui layout的收起按钮，不允许收起 */
$(function() {
	$('.layout-button-left').parent().remove();
	$('.layout-button-up').parent().remove();
	$('.layout-button-right').parent().remove();
	$('.layout-button-down').parent().remove();
});

/* 保存用户个性化首页设置 */
function saveUserViewConfig() {
	var url = "";
	// alert(hasconfig);
	$.post(rootPath + '/jasframework/login/SysUserconfig/getUserViewConfig.do', function(result) {

	}, 'json');
	if (hasconfig == '0') {
		url = rootPath + "/jasframework/login/SysUserconfig/saveUserViewConfig.do";
	} else {
		url = rootPath + "/jasframework/login/SysUserconfig/updateUserViewConfig.do";
	}

	if (document.getElementById('show2d').checked) {
		document.getElementById('show2d').value = "1";
	} else {
		document.getElementById('show2d').value = "0";
	}
	if (document.getElementById('show3d').checked) {
		document.getElementById('show3d').value = "1";
	} else {
		document.getElementById('show3d').value = "0";
	}

	$('#SysUserviewconfigForm').form('submit', {
		url : url,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			var result = eval('(' + result + ')');
			if (result.success) {
				// $.messager.alert('成功', '保存首页设置成功', 'info');
				$.messager.alert(getLanguageValue("success"), getLanguageValue("savesuccess"), 'info');
			} else {
				$.messager.alert(getLanguageValue("error"), getLanguageValue("savefailure"), 'info');
				// $.messager.alert('错误', '保存首页设置失败', 'error');
			}
		}
	});
}

// 单选按钮的选中与取消
var tempradio = null;
function check(checkedRadio) {
	if (tempradio == checkedRadio) {
		tempradio.checked = false;
		tempradio = null;
	} else {
		tempradio = checkedRadio;
	}
}

// 添加到我的菜单
function addToMyConfigFunction(node) {
	if (node == null) {
		node = $('#allFuntionMenuTree').tree('getSelected');
	}
	if (node == null) {
		$.messager.alert(getLanguageValue("tip"), getLanguageValue("choosemenu"), 'info');
		// $.messager.alert('提示', '请选择要添加的功能菜单！', 'info');
		return;
	}
	var isLeaf = $('#allFuntionMenuTree').tree('isLeaf', node.target);
	if (isLeaf) {// 只有叶子节点才可以添加到我的菜单
		var dd = $('#myConfigFunctionMenuTree').tree('find', node.attributes.functionid);
		if (dd == null) {
			var selectedNode = $('#myConfigFunctionMenuTree').tree('getSelected');
			if (selectedNode) {
				if (selectedNode.attributes && selectedNode.attributes.type == '0') {
					$('#myConfigFunctionMenuTree').tree('append', {
						parent : selectedNode.target,
						data : [ {
							id : node.attributes.functionid,
							text : node.text,
							attributes : {
								type : 1
							}
						} ]
					});
				} else {
					$.messager.alert(getLanguageValue("tip"), getLanguageValue("onlydirectory"), 'info');
					// $.messager.alert('提示', '只能选择目录节点！', 'info');
				}
			} else {
				$.messager.alert(getLanguageValue("tip"), getLanguageValue("choosedirectory"), 'info');
				// $.messager.alert('提示', '请选择要添加到的菜单目录！', 'info');
			}
		} else {
			$.messager.alert(getLanguageValue("tip"), getLanguageValue("menuexist"), 'info');
			// $.messager.alert('提示', '该功能已经添加到我的菜单，请添加其他功能菜单！', 'info');
		}
	} else {
		$('#allFuntionMenuTree').tree('toggle', node.target);
	}
}
/* 添加目录 */
function addForder(type) {
	if (type == null) {
		var functionname = document.getElementById('functionname').value;
		if (functionname == null || functionname == '') {
			$.messager.alert(getLanguageValue("tip"), getLanguageValue("Notdirectoryname"), 'info');
			// $.messager.alert('提示', '请填写目录名称！', 'info');
			return;
		}
		var rootNodesArray = $('#myConfigFunctionMenuTree').tree('getRoots');
		if (rootNodesArray) {
			for ( var i = 0; i < rootNodesArray.length; i++) {
				var text = rootNodesArray[i].text;
				if (text == functionname) {
					$.messager.alert(getLanguageValue("tip"), getLanguageValue("directorynameexist"), 'info');
					// $.messager.alert('提示', '目录已存在，请选用其他目录名称！', 'info');
					return;
				}
			}
		}
		$('#myConfigFunctionMenuTree').tree('append', {
			// parent: selectedNode.target,
			data : [ {
				id : functionname,
				text : functionname,
				// iconCls:"icon-forder",
				attributes : {
					type : 0
				}
			} ]
		});
	} else if (type == '1') {
		var rootNodesArray = $('#myConfigFunctionMenuTree').tree('getRoots');
		functionid = rootNodesArray.length;
		functionname = '新建文件夹';
		$('#myConfigFunctionMenuTree').tree('append', {
			// parent: selectedNode.target,
			data : [ {
				id : functionid,
				text : functionname,
				attributes : {
					type : 0
				}
			} ]
		});
		var node = $('#myConfigFunctionMenuTree').tree('find', functionid);
		$('#myConfigFunctionMenuTree').tree('beginEdit', node.target);
	}

}

// 修改目录
function updateForder(type) {
	if (type == null) {
		var functionname = document.getElementById('functionname').value;
		if (functionname == null || functionname == '') {
			$.messager.alert(getLanguageValue("tip"), getLanguageValue("Notdirectoryname"), 'info');
			// $.messager.alert('提示', '请填写目录名称！', 'info');
			return;
		}
		var rootNodesArray = $('#myConfigFunctionMenuTree').tree('getRoots');
		if (rootNodesArray) {
			for ( var i = 0; i < rootNodesArray.length; i++) {
				var text = rootNodesArray[i].text;
				if (text == functionname) {
					$.messager.alert(getLanguageValue("tip"), getLanguageValue("directorynameexist"), 'info');
					// $.messager.alert('提示', '目录已存在，请选用其他目录名称！', 'info');
					return;
				}
			}
		}
		var selectedNode = $('#myConfigFunctionMenuTree').tree('getSelected');
		if (selectedNode) {
			$('#myConfigFunctionMenuTree').tree('update', {
				target : selectedNode.target,
				text : functionname
			});
		} else {
			$.messager.alert(getLanguageValue("tip"), getLanguageValue("chooseupdatedirectory"), 'info');
			// $.messager.alert('提示', '请选择要修改的目录节点！', 'info');
		}
	} else if (type == '1') {
		var node = $('#myConfigFunctionMenuTree').tree('getSelected');
		$('#myConfigFunctionMenuTree').tree('beginEdit', node.target);
	}
}

// 删除目录 或者菜单
function deleteForder() {
	var selectedNode = $('#myConfigFunctionMenuTree').tree('getSelected');
	if (selectedNode) {
		$('#myConfigFunctionMenuTree').tree('remove', selectedNode.target);
	} else {
		$.messager.alert(getLanguageValue("tip"), getLanguageValue("choosedeletedirectory"), 'info');
		// $.messager.alert('提示', '请选择要删除的目录或菜单节点！', 'info');
	}
}
// 设置为首页
function defaltPage(type) {
	var functionid = "";
	var functionname = "";
	if (type == '0') {
		functionid = document.getElementById('functionid').value
		functionname = document.getElementById('functionname').value
	} else {
		var selectedNode = $('#allFuntionMenuTree').tree('getSelected');
		functionid = selectedNode.id;
		functionname = selectedNode.text;
	}
	document.getElementById('homefunctionname').value = functionname;
	document.getElementById('homefunctionid').value = functionid;
}
function clearDefortPage() {
	document.getElementById('homefunctionname').value = "";
	document.getElementById('homefunctionid').value = "";
}
/* 新增 */
function save() {
	$('#SysUserfunctionconfigForm').form('submit', {
		url : rootPath + "jasframework/login/SysUserconfig/saveSysUserfunctionconfig.do",
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			var result = eval('(' + result + ')');
			if (result.success) {
				$("#functionname").val('');
			} else {
				$.messager.alert(getLanguageValue("error"), result.msg, 'error');
			}
		}
	});
}

/* 修改 */
function update() {
	$('#SysUserfunctionconfigForm').form('submit', {
		url : rootPath + "/jasframework/login/SysUserconfig/updateSysUserfunctionconfig.do",
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			var result = eval('(' + result + ')');
			if (result.success) {
				$("#functionname").val('');
			} else {
				$.messager.alert(getLanguageValue("error"), result.msg, 'error');
			}
		}
	});
}

/* 删除 */
function remove() {
	var rows = $('#tt').tree('select', node.target);
	if (rows.length > 0) {
		var ids = new Array();
		for ( var i = 0; i < rows.length; i++) {
			ids[i] = rows[i].eventid;
		}
		ids = ids.toString();
		$.messager.confirm(getLanguageValue("deleteconfirm"), getLanguageValue("deleteconfirm2") + rows.length + getLanguageValue("deleteconfirm3"),
				function(r) {
					if (r) {
						var postUrl = rootPath + '/jasframework/login/SysUserconfig/deleteSysUserfunctionconfig.do';
						$.post(postUrl, {
							'ids' : ids
						}, function(result) {
						}, 'json');
					}
				});
	} else {
		$.messager.alert(getLanguageValue("tip"), getLanguageValue("chooserecord"), 'info');
		return;
	}
}