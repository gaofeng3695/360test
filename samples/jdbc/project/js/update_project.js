/** 
 * @file
 * @author  zhangxz
 * @version 1.0 
 * @desc  修改用户档案js
 * @date  2017-08-10  
 * @last modified by zhangxz
 * @last modified time  2017-08-19
 */

/**
 * @desc 初始化
 */
$(document).ready(function(){
	loadData();
});

/**
 * @desc 加载数据初始数据
 */
function loadData() {
	var oid;
	var param = this.location.search;
	
	if (param != null && "" != param) {
		oid = getParamter("oid");
	}
	if (oid != null && "" != param) {
		$.getJSON(rootPath+"project/get.do", {
			"oid" : oid
		}, function(json) {
			putValue(json);
		});
		
		// 加载图片信息
//		getPicListInfo(oid,"update","","samples");  // 不带描述信息的修改
//		getPicListInfo(oid,"update","addDesc","samples");  // 带描述信息的修改
		
//		getPicListInfo(oid,"update","addDesc",{
//			moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
//			fileNumLimit:2  // 上传文件的个数 不传默认值为200
//		});  // 带描述信息的修改
//		
		
//		// 附件和图片同时存在    先上传附件  后上传图片
//		getFileListInfo(oid,"update","samples","1"); // 获取文件信息
//		getPicListInfo(oid,"update","","samples","2");  // 不带描述信息的修改
		
		getFileListInfo(oid,"update",{
			moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
			fileNumLimit:2,  // 上传文件的个数 不传默认值为200
		}); // 获取文件信息  、、,"1"
//		getPicListInfo(oid,"update","",{
//			//url : rootPath+"/attachment/upload.do",
//			moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
//			fileNumLimit:2,  // 上传文件的个数 不传默认值为200
//			extensions:"png", // 默认"gif,jpg,jpeg,bmp,png"
//		},"2");  // 不带描述信息的修改	
		
//		// 附件和图片同时存在    先上传图片  后上传附件
//		getFileListInfo(oid,"update","samples","2"); // 获取文件信息
//		getPicListInfo(oid,"update","","samples","1");  // 不带描述信息的修改
		
		
//		// 附件和图片同时存在    先上传附件  后上传图片
//		getFileListInfo(oid,"update","samples","1"); // 获取文件信息
//		getPicListInfo(oid,"update","addDesc","samples","2");  // 带描述信息的修改
		
		
//		所有samples的地方可以仅仅只写Kass的模块名还可以写一个对象，里面传递的是文件上传和图片上传的基本配置项
	}
}

/**
 * @desc 显示数据
 * @param obj 数据
 */
function putValue(json) {
	$("#oid").val(json.data.oid);
	$("#projectName").val(json.data.projectName);
	$("#projectCode").val(json.data.projectCode);	
}


/**
 * @desc 关闭添加页面
 */
function closePanel(){
	top. closeDlg("updateiframe");
}

/**
 * @desc 重新加载数据
 * @param url 重新加载数据的页面
 * @param elementId datagridID
 */
function reloadData(url, elementId){
	var fra= parent.$("iframe");
	for(var i=0; i<fra.length;i++) {
		if(fra[i].src.indexOf(url) != -1) {
			fra[i].contentWindow.$(elementId).datagrid("reload");
		}
	}
}

/**
 * @desc 更新用户档案
 */
function update(){
	disableButtion("savebutton");
	//获取表单中的json
	var json = JSON.stringify($("#saveProject").serializeToJson());
	$.ajax({
		url: rootPath+"project/update.do",
	    type: "post",
	    contentType: "application/json;charset=utf-8",
	    dataType: "json",
	    data:json,//获取表单中的json,
	    success: function(data){
	    	if(data.status==1){
	    		updateFileFun(updateSuccessFun);
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
	    }
	 });
 	enableButtion("savebutton");
}

function updateSuccessFun(){
	top.showAlert("提示", "保存成功", 'info', function() {
		reloadData('query_project.htm','#dg');
		closePanel();
	});
}