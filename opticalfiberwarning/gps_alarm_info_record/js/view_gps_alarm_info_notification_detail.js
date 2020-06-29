
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
	getGpsAlarmInfoNoticationDeatailById();
});

/**
 * @desc 获得数据
 */
function getGpsAlarmInfoNoticationDeatailById(){
	$.ajax({
		url : rootPath+"/gpsalarmnotification/get.do",
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
	$("#alarmOid").html(jsondata.alarmOid);
	$("#receiverName").html(jsondata.receiverName);
	$("#phoneNumber").html(jsondata.phoneNumber);
	$("#receiverTypeName").html(jsondata.receiverTypeName);
	$("#sendStatus").html(jsondata.sendStatus);
	$("#sendDatetime").html(jsondata.sendDatetime);
	$("#notificationStatus").html(jsondata.notificationStatus);
	$("#openDatetime").html(jsondata.openDatetime);
	$("#msgContent").html(jsondata.msgContent);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top.closeDlg("viewAlarmNotificationDetail");
}

