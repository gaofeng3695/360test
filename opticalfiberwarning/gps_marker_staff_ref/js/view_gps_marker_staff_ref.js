
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
	getGpsMarkerStaffRefById();
});

/**
 * @desc 获得数据
 */
function getGpsMarkerStaffRefById(){
	$.ajax({
		url : rootPath+"/gpsmarkerstaffref/get.do",
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
	$("#remarks").html(jsondata.remarks);
	$("#unitid").html(jsondata.unitname);
	$("#fiberSystemId").html(jsondata.fiberSystemId);
	$("#opticalFiberLineloop").html(jsondata.opticalFiberLineloop);
	$("#opticalFiberStation").html(jsondata.opticalFiberStation);
	$("#lineloopoid").html(jsondata.lineloopName);
	$("#startMarkeroid").html(jsondata.startMarkeroid);
	$("#endMarkeroid").html(jsondata.endMarkeroid);
	$("#startMileage").html(jsondata.startMileage);
	$("#endMileage").html(jsondata.endMileage);
	$("#stationMaster").html(jsondata.stationMasterName);
	$("#stationMasterTel").html(jsondata.stationMasterTel);
	$("#sectionLeader").html(jsondata.sectionLeaderName);
	$("#sectionLeaderTel").html(jsondata.sectionLeaderTel);
	$("#segment").html(jsondata.segmentName);
	$("#segmentTel").html(jsondata.segmentTel);
	$("#inspector").html(jsondata.inspectorName);
	$("#inspectorTel").html(jsondata.inspectorTel);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsMarkerStaffRef");
}

