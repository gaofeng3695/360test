
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
	getGpsTemporaryTaskPointById();
});

/**
 * @desc 获得数据
 */
function getGpsTemporaryTaskPointById(){
	$.ajax({
		url : rootPath+"/gpstemporarytaskpoint/get.do",
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
	$("#pointName").html(jsondata.pointName);
	$("#inspectorName").html(jsondata.inspectorName);
	$("#arrivaltime").html(jsondata.arrivaltime);
	$("#remaintime").html(jsondata.remaintime);
	$("#lon").html(jsondata.lon);
	$("#lat").html(jsondata.lat);
	if(jsondata.pointstatus == '0'){
		$("#pointstatus").html('未巡检');
	}else if(jsondata.pointstatus == '1'){
		$("#pointstatus").html('已巡检');
	}else{
		$("#pointstatus").html('异常');
	}
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsTemporaryTaskPoint");
}

