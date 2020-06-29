
/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("oid");	// 业务数据ID
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){
	getGpsSecurityStandardById();
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
});

/**
 * @desc 获得数据
 */
function getGpsSecurityStandardById(){
	$.ajax({
		url : rootPath+"/gpssecuritystandard/get.do",
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
	$("#unitid").html(jsondata.unitname);
	$("#title").html(jsondata.title);
	if(jsondata.type==0){
		$("#type").html('国家标准');
	}else if(jsondata.type==1){
		$("#type").html('行业标准');
	}else if(jsondata.type==2){
		$("#type").html('企业标准');
	}else if(jsondata.type==3){
		$("#type").html('规范性文件');
	}else if(jsondata.type==4){
		$("#type").html('其他文件');
	}
	$("#uploadTime").html(jsondata.uploadTime);
	$("#uploadingStaff").html(jsondata.uploadingStaff);
	$("#fileSize").html(jsondata.fileSize);
	$("#content").html(jsondata.content);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsSecurityStandard");
}

