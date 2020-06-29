/** 
 * @file
 * @author  xxx
 * @version 1.0 
 * @desc  查询角色js
 * @date  2012-08-30 上午17:46:07 
 * @last modified by lizz
 * @last modified time  2017-08-17
 */

var oid = "";

//初始化
$(function() {
	oid = getParamter("oid");
	 getRoleById();
});



/**
 * @desc 描述：关闭查看页面
 */
function closeRole() {
	top. closeDlg("view");
}


/**
 * @desc 加载数据
 */
function getRoleById() {
	$.getJSON(rootPath+"jasframework/privilege/role/getRoleById.do", {
		"oid" : oid
	}, function(data) {
		loadData(data.data);
	});
}

/**
 * @desc 显示数据
 * @param obj 数据
 */
function loadData(obj) {
	obj.roleType = obj.roleType||"";
	if(obj.roleType){
		obj.roleType = obj.roleType == "2"?"protect":"private";
	}
	$("#name").html(obj.roleName);
	$("#unitName").html(obj.unitName);
	$("#roleType").html(obj.roleType);
	$("#description").html(obj.description);

	$("#dataFilterRegulationName ").html(obj.dataFilterRegulationName);
}

