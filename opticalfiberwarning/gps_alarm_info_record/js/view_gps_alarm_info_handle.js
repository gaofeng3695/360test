
/**
 * @file
 * @author 作者
 * @desc 查看页面
 * @date YYYY-MM-DD
 * @last modified by 作者
 * @last modified time YYYY-MM-DD HH:mm:ss
 */

var pkfield=getParamter("alarmOid");	// 业务数据ID
var businessId = "";
/**
 * @desc 初始化
 */
$(document).ready(function(){
	getGpsAlarmInfoHandleById();
});

/**
 * @desc 获得数据
 */
function getGpsAlarmInfoHandleById(){
	$.ajax({
		url: rootPath+"/gpsalarminfohandle/getByAlarmOid.do?alarmOid="+pkfield,
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
	$("#alarmid").html(jsondata.alarmid);
	$("#sourceSystem").html(jsondata.sourceSystem);
	$("#alarmLevel").html(jsondata.alarmLevel);
	$("#alarmInformation").html(jsondata.alarmInformation);
	$("#handleSituation").html(jsondata.handleSituation);
	$("#handleDatetime").html(jsondata.handleDatetime);
	$("#handler").html(jsondata.handler);
	$("#approver").html(jsondata.approver);
	$("#alarmStatus").html(jsondata.alarmStatus);
	$("#processStatus").html(jsondata.processStatus);
	$("#otherInfo").html(jsondata.otherInfo);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top.closeDlg("viewGpsAlarmInfoRecord");
}

