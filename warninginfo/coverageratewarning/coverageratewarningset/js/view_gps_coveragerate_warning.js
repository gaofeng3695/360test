
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
	getGpsCoveragerateWarningById();
});

/**
 * @desc 获得数据
 */
function getGpsCoveragerateWarningById(){
	$.ajax({
		url : rootPath+"/gpscoverageratewarning/get.do",
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
	$("#taskcover").html(jsondata.taskcover+"%");
	$("#plancover").html(jsondata.plancover+"%");
	$('#warntime').html(jsondata.warntime);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsCoveragerateWarning");
}
