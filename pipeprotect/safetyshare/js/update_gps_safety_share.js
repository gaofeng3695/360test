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

/**
 * @desc 页面初始化完毕执行
 */
$(document).ready(function() {
	//初始化部门下拉框
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.273,'combobox');
	
	getGpsSafetyShareById();
	getFileListInfo(pkfield, "update", {
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
	},"1"); // 获取文件信息
	getPicListInfo(pkfield, "update", "", {
		//url : rootPath+"/attachment/upload.do",
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
		extensions:"png", // 默认"gif,jpg,jpeg,bmp,png"
	},"2");  
});

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
		reloadData("query_gps_safety_share.html","#gpsSafetySharedatagrid");
	    closePanel();
	});
}
/**
 * @desc 修改数据-保存
 */
function updateGpsSafetyShare(){
	disableButtion("saveButton");
	var bool=$('#gpsSafetyShareForm').form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;	
	}
	$.ajax({
		url : rootPath+"/gpssafetyshare/update.do",
		type: "post",
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($('#gpsSafetyShareForm').serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
	    		updateFileFun(updateFileSuccessFun);  // 先上传附件 后上传图片
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
 * @desc 获得数据
 */
function getGpsSafetyShareById(){
	$.ajax({
		url : rootPath+"/gpssafetyshare/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
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
 * @desc 数据加载到页面
 */
function loadData(jsondata){
	$('#oid').val(jsondata.oid);
	$('#unitid').combotree('setValue',jsondata.unitid);
	$('#title').val(jsondata.title);
	$('#occurrencetime').val(jsondata.occurrencetime);
	$('#describe').val(jsondata.describe);
	$('#cause').val(jsondata.cause);
	$('#result').val(jsondata.result);
	$('#experience').val(jsondata.experience);
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
	top. closeDlg("updateGpsSafetyShare");
}


