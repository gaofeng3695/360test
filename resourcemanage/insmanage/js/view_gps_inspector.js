
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
	getGpsInspectorById();
});

/**
 * @desc 获得数据
 */
function getGpsInspectorById(){
	$.ajax({
		url : rootPath+"/gpsinspector/get.do",
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
	$("#unitname").html(jsondata.unitname);
	$("#insname").html(jsondata.insname);
	$("#sexCodeName").html(jsondata.sexName);
	$("#phone").html(jsondata.phone);
	$("#deviceoid").html(jsondata.deviceCode);
	$("#instypeCodeName").html(jsondata.instypeCodeName);
	$("#adddate").html(jsondata.adddate);
	$("#identitycard").html(jsondata.identitycard);
	$("#homeaddress").html(jsondata.homeaddress);
	$("#description").html(jsondata.description);
}
/**
 * @desc 关闭查看页面
 */
function closePanel() {
	top. closeDlg("viewGpsInspector");
}

