
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
	getGpsKeypointById();
	// 加载图片信息
	getPicListInfo(pkfield, "view");  // 不带描述信息  图片
	getFileListInfo(pkfield, "view"); // 附件信息
});

/**
 * @desc 获得数据
 */
function getGpsKeypointById(){
	$.ajax({
		url : rootPath+"/gpskeypoint/get.do",
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
	$("#pointname").html(jsondata.pointname);
	$("#lineloopoid").html(jsondata.lineloopoName);
	$("#pointstation").html(jsondata.pointstation);
	$("#pointposition").html(jsondata.pointposition);
	$("#unitid").html(jsondata.unitname);
	$("#lon").html(jsondata.lon);
	$("#lat").html(jsondata.lat);
	$("#effectivebegindate").html(jsondata.effectivebegindate);
	$("#effectiveenddate").html(jsondata.effectiveenddate);
	$("#buffer").html(jsondata.buffer);
	$("#pointtype").html(jsondata.pointtypeName);
	$("#markeroid").html(jsondata.markerName);
	$("#description").html(jsondata.description);
	$("#residentTime").html(jsondata.residentTime);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsKeypoint");
}

