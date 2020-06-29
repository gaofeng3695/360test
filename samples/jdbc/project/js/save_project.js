/** 
 * @file
 * @author  zhangxz
 * @version 1.0 
 * @desc  新增用户档案js
 * @date  2017-08-10  
 * @last modified by zhangxz
 * @last modified time  2017-08-19
 */
var businessId = "";
/**
 * @desc 初始化
 */
$(function(){

	$('#savebutton').bind('click',function(){
	});
	
//	// 不带描述信息的图片上传    // 先执行的没有执行成功事件
//	$("#picUpload").initializeWebUploader({
//		fileType:"pic",
//		addDesc:"false",
//		uploadBtn:"#savebutton",
//		url : rootPath+"/attachment/upload.do",
//		folderId:'190c533a-2753-4588-99f2-28a8f897721f', // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
//		
////		fileNumLimit:2,  // 上传文件的个数不传有默认值200
////		extensions:"png", // 上传文件的后缀 不传有默认值
//		
//		picAndFile:"all", // 图片和附件同时存在     标识
//		
//		uploadBeforeFun:function(){
//			 var bsId = save();
//	    	 return bsId;
//		}
//		// 这里没有执行成功事件
//	});

	// 带描述信息的文件上传
	$("#fileUpload").initializeWebUploader({
		fileType:"file",
		addDesc:"true",
		uploadBtn:"#savebutton",
		
		url : rootPath+"attachment/upload.do",
		
		folderId:'190c533a-2753-4588-99f2-28a8f897721f', // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default//19ca5f7e-6440-41d5-9080-6a1c2f83e2e1
//		fileNumLimit:2,  // 上传文件的个数 不传默认值为200
//		extensions:"doc,docx", // 上传文件的后缀 不传默认值为'doc,docx,xlsx,xls,pdf,zip,ppt,pptx'
		
		uploadBeforeFun:function(){
			 var bsId = save();
	    	 return bsId;
		},
		uploadSuccessFun:function(){
			// 文件上传成功之后执行的
			if(refid != ""){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData('query_project.htm','#dg');
//	                 uploadfile(closePanel);
					closePanel();
				});
			}
		}
	})

});

/**
 * @desc 新增用户
 */
function save(){
	disableButtion("savebutton");
	//获取表单中的json
	var json = JSON.stringify($("#saveProject").serializeToJson());
	//表单中的用户名不重名，可以新增
	var businessid = null;
	$.ajax({
		url: rootPath+"project/save.do",//调用新增接口
	    type: "post",
	    contentType: "application/json;charset=utf-8",
	    dataType: "json",
	    async:false,
	    data:json,//获取表单中的json,
	    success: function(data){
			if(data.status==1){
				businessid=data.data;
				refid=data.data;
//				top.showAlert("提示", "保存成功", 'info', function() {
//					reloadData('query_project.htm','#dg');
//					closePanel();
//				});
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
 	return businessid
}


/**
 * @desc 关闭添加页面
 */
function closePanel(){
	top. closeDlg("saveiframe");
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
