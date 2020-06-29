/**
 * 
 * 文件描述: 权限控制js，目前只实现操作按钮权限控制。
 *
 * @author yanght
 * @version 1.0
 * 创建时间： 2012-08-30 上午17:46:07
 *********************************更新记录******************************
 * 版本：  1.0       修改日期：   2012-12-01       修改人： zhanggf
 * 修改内容： 
 **********************************************************************
 */

/**
 * 功能描述：页面加载完毕之后，首先将datagrid中的操作按钮置为不可用状态，并调用操作按钮权限获取接口获取操作按钮权限
 */
var allPriveilegeNumber=[];
// 应用系统ID
var defaultAppId = "402894a152681ba30152681e8b320003";
$(window).bind("load", function() {
/*	var buttons = $(".datagrid-toolbar >.easyui-linkbutton");
	$.each(buttons, function(i, item) {
		$("#" + item.id).css("display", "none");
	});*/
	getPrivilege();
});

/**
 * 
 * 功能描述：获取操作按钮权限，并将相应按钮置为可用
 * 
 * @param menuid
 */
function getPrivilege() {
	$(".datagrid-toolbar >.easyui-linkbutton").hide();
	$(".datagrid-toolbar >.easyui-menubutton").hide();
	var menuid = $("#menuid").val();
	$.getJSON(rootPath + "/jasframework/privilege/privilege/getPageConfig.do", {
		"menuFunctionCode" : menuid,
		"appId" : defaultAppId
	}, function(data) {
		$.each(data, function(i, item) {
			$.each(item.children, function(i, item1) {
				$("#" + item1.attributes.privilegeCode).show();
				allPriveilegeNumber.push(item1.attributes.privilegeCode);
			});
		});
		if(typeof privilegeCallBack != 'undefined'){
			privilegeCallBack();
		}
	});
}

/**
 * @desc 功能描述：获取datagrid里面操作按钮权限，并将相应按钮置为可用
 * @param menuid
 */
function getDataPrivilege(){
	var menuid = $("#menuid").val();
	$(".table-operate a").hide();
	$.getJSON(rootPath + "/jasframework/privilege/privilege/getPageConfig.do", {
		"menuFunctionCode" : menuid,
		"appId" : defaultAppId
	}, function(data) {
		$.each(data, function(i, item) {
			$.each(item.children, function(i, item1) {
				$(".a" + item1.attributes.privilegeCode).show();
			});
		});
	});
}

/**
 * 功能描述:获取三维列式菜单或表格菜单的授权按钮
 * 	
 * @param itemType 三维菜单类型，列式菜单|表格式菜单（item|tableIteam）
 * @param allItems 三维中所有要创建的列式菜单或表格菜单按钮
 * @returns 返回当前用户具有权限的列式（后表格式）菜单按钮
 */
function getPrivilegeItems(itemType,allItems){
	var itemArry=new Array();
	if(itemType=="item"){
		for(var i=0;i<allItems.length;i++){
			for(var j=0;j<allPriveilegeNumber.length;j++){
				if(allItems[i].itemId==allPriveilegeNumber[j]){
					itemArry.push(allItems[i]);
					break;
				}
			}
		}
	}else if(itemType=="tableIteam"){
		for(var i=0;i<allItems.length;i++){
			for(var j=0;j<allPriveilegeNumber.length;j++){
				if(allItems[i].tableId==allPriveilegeNumber[j]){
					itemArry.push(allItems[i]);
					break;
				}
			}
		}
	}
	return itemArry;
}