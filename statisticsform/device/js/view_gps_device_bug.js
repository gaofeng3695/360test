
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
	getGpsDeviceBugById();
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
});

/**
 * @desc 获得数据
 */
function getGpsDeviceBugById(){
	$.ajax({
		url : rootPath+"/gpsdevicebug/getdetail.do",
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
	$("#deviceoid").html(jsondata.deviceoid);
	$("#bugbegindata").html(jsondata.bugbegindata);
	$("#bugendindata").html(jsondata.bugendindata);
	$("#bugphenomenonName").html(jsondata.bugphenomenonName);
	$("#applyremarks").html(jsondata.applyremarks);
	$("#applypeopleName").html(jsondata.applypeopleName);
	$("#buggeasonName").html(jsondata.buggeasonName);
	$("#solveremarks").html(jsondata.solveremarks);
	$("#approvamarks").html(jsondata.approvamarks);
	$("#approvapleName").html(jsondata.approvapleName);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsDeviceBug");
}

