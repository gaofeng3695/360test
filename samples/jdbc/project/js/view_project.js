/** 
 * @file
 * @author  zhangxz
 * @version 1.0 
 * @desc  新增用户档案js
 * @date  2017-08-10  
 * @last modified by zhangxz
 * @last modified time  2017-08-19
 */

/**
 * @desc 初始化
 */
$(function() {
	loadData();
});

/**
 * @desc 载入数据
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
		getPicListInfo(oid,"view");  // 不带描述信息  图片
//		getPicListInfo(oid,"view","addDesc");  // 带描述信息  图片
		
		getFileListInfo(oid,"view"); // 附件信息
	}
}

/**
 * @desc 显示数据
 * @param obj 数据
 */
function putValue(json) {
	$("#projectName").val(json.data.projectName);
	$("#projectCode").val(json.data.projectCode);	
}
	
/**
 * @desc 关闭查看页面
 */
function closePanel(){
	top. closeDlg("viewiframe");
}