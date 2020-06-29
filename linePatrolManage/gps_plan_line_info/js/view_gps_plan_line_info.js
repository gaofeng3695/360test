
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
	getGpsPlanInfoById();
});

/**
 * @desc 获得数据
 */
function getGpsPlanInfoById(){
	$.ajax({
		url : rootPath+"/gpsplaninfo/get.do",
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
	$("#planno").html(jsondata.planno);
	$("#instypeCodeName").html(jsondata.instypeCodeName);
	$("#execunitid").html(jsondata.execunitid);
	$("#inspectortypeCodeName").html(jsondata.inspectortypeCodeName);
	/*$("#insfreq").html(jsondata.insfreq);
	$("#insfrequnitCodeName").html(jsondata.insfrequnitCodeName);
	$("#insfrequnitval").html(jsondata.insfrequnitval);*/
	$("#insvehicleCodeName").html(jsondata.insvehicleCodeName);
	$("#insbdate").html(jsondata.insbdate);
	$("#insedate").html(jsondata.insedate);
	$("#determinant").html(jsondata.determinant);
	$("#repealdate").html(jsondata.repealdate);
	$("#planflagCodeName").html(jsondata.planflagCodeName);
	$("#unitid").html(jsondata.unitid);
	$("#syncdate").html(jsondata.syncdate);
	$("#ispis").html(jsondata.ispis);
	$('#insfreqcont').html(jsondata.insfrequnitval + (jsondata.insfrequnit=='01'?'日':jsondata.insfrequnitCodeName) + jsondata.insfreq + '巡');
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsPlanLineInfo");
}

