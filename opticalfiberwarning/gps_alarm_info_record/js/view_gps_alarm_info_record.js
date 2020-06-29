
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
	getGpsAlarmInfoRecordById();
});

/**
 * @desc 获得数据
 */
function getGpsAlarmInfoRecordById(){
	$.ajax({
		url : rootPath+"/gpsAlarmInfoRecord/get.do",
		data :{"oid" : pkfield},
		type : 'POST',
		dataType:"json",
		async:true,
		success : function(data) {
			if(data.status==1){
				loadData(data.data);
				$('#alarminfo_notification').attr('src',"view_gps_alarm_info_notification.html?alarmOid="+data.data.alarmid);
				$('#alarminfo_handle').attr('src',"view_gps_alarm_info_handle.html?alarmOid="+data.data.alarmid);
			}else{
				$('#alarminfo_notification').attr('src',"view_gps_alarm_info_error.html");
				$('#alarminfo_handle').attr('src',"view_gps_alarm_info_error.html");
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
	$("#alarmid").html(jsondata.alarmid);
	$("#eid").html(jsondata.eid);
	$("#unitname").html(jsondata.unitname);
	$("#lineloopName").html(jsondata.lineloopName);
	$("#manageStatus").html(jsondata.manageStatus);
	$("#belongtoStation").html(jsondata.belongtoStation);
	$("#administrativeDivision").html(jsondata.administrativeDivision);
	$("#markerPosition").html(jsondata.markerPosition);
	$("#mileage").html(jsondata.mileage);
	$("#fiberDistance").html(jsondata.fiberDistance);
	$("#alarmType").html(jsondata.alarmType);
	$("#alarmLevel").html(jsondata.alarmLevel);
	$("#startTime").html(jsondata.startTime);
	$("#latestTime").html(jsondata.latestTime);
	$("#confirmationRecord").html(jsondata.confirmationRecord);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top.closeDlg("viewGpsAlarmInfoRecord");
}

