
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
	getGpsUnsubinspectionById();
});

/**
 * @desc 获得数据
 */
function getGpsUnsubinspectionById(){
	$.ajax({
		url : rootPath+"/gpsunsubinspection/get.do",
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
	$("#unitidname").html(jsondata.unitidname);
	$("#lineloopoidname").html(jsondata.lineloopoidname);
	$("#beginstation").html(jsondata.beginstation);
	$("#endstation").html(jsondata.endstation);
	$("#syncdate").html(jsondata.syncdate);
	$("#beginlocation").html(jsondata.beginlocation);
	$("#endlocation").html(jsondata.endlocation);
	$("#begindate").html(jsondata.begindate);
	$("#enddate").html(jsondata.enddate);
	$("#repealdate").html(jsondata.repealdate);
	$("#description").html(jsondata.description);
	if(jsondata.isPis == 1){
		$("#isPis").html("是");
	}else{
		$("#isPis").html("否");
	}
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsUnsubinspection");
}

