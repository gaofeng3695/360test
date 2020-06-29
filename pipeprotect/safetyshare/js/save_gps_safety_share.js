
/**
 * @file
 * @author 作者
 * @desc 添加页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */
var businessId;    // 附件上传业务ID

/**
 * @desc 页面初始化
 */
$(document).ready(function(){
	//初始化部门下拉框
	initUnitComboTree('unitid');
	setComboObjWidth('unitid',0.275,'combobox');
	
	/* 初始化部门 */
	$('#unitid').combotree('setValue',user.ext_field2);

	// 不带描述信息的图片上传    // 先执行的没有执行成功事件
	$("#picUpload").initializeWebUploader({
		fileType:"pic",
		addDesc:"false",
		uploadBtn:"#saveButton",
		url : rootPath+"/attachment/upload.do",
		moduleCode:"samples",
		
		fileNumLimit:20,  // 上传文件的个数不传有默认值200
//		extensions:"png", // 上传文件的后缀 不传有默认值
		
		picAndFile:"all", // 图片和附件同时存在     标识
		
		uploadBeforeFun:function(){
			var bsId = saveBaseInfo();
			return bsId;
		}
		// 这里没有执行成功事件
	});

	// 带描述信息的文件上传    // 后执行的没有上传按钮
	$("#fileUpload").initializeWebUploader({
		fileType:"file",
		addDesc:"true",
		// 这里没有开始上传事件的触发按钮
		url : rootPath+"/attachment/upload.do",
		moduleCode:"samples", // 子系统业务模块名,用于上传到KASS系统中的目录分类，不传默认default
	
		fileNumLimit:20,  // 上传文件的个数 不传默认值为200
//		extensions:"doc,docx", // 上传文件的后缀 不传默认值为'doc,docx,xlsx,xls,pdf,zip,ppt,pptx'
		
		picAndFile:"all", // 图片和附件同时存在     标识
		
		uploadBeforeFun:function(){
			var bsId = saveBaseInfo();
			return bsId;
		},
		uploadSuccessFun:function(){
				top.showAlert("提示", "保存成功", 'info', function() {
					reloadData("query_gps_safety_share.html","#gpsSafetySharedatagrid");
					closePanel();
				});
		}
	});
	
});

/**
 * @desc 保存基本信息获取业务id
 */
function saveBaseInfo(){
	var  bID = null;
	if(isNull(businessId)){
		bID = saveGpsSafetyShare();  // sava()保存基本信息函数，返回业务id
	}else{
		bID = businessId;
	}
	return bID;
}

/**
 * @desc 添加数据-保存
 */
function saveGpsSafetyShare(){
	disableButtion("saveButton");
	var bool=$("#gpsSafetyShareForm").form('validate');
	if(bool==false){
		enableButtion("saveButton");
		return bool;
	}
	$.ajax({
		url : rootPath+"/gpssafetyshare/save.do",
		type: "post",
		async: false,
		contentType: "application/json;charset=utf-8",
		dataType: "json",
		data:JSON.stringify($("#gpsSafetyShareForm").serializeToJson()),
		success: function(data){
			if(data.status==1){
				businessId=data.data;
			}else if(data.code == "400") {
				top.showAlert("提示", "保存失败", 'error');
				enableButtion("saveButton");
			}else{
				top.showAlert("提示", data.msg, 'info');
				enableButtion("saveButton");
			}
		}
	});
	enableButtion("saveButton");
	
		return businessId;    // 附件上传业务ID

}


/**
 * @desc 关闭添加页面
 */
function closePanel() {
	top. closeDlg("addGpsSafetyShare");
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

